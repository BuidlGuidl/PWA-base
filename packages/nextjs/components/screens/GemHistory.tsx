import { useEffect, useState } from "react";
import { createPublicClient, formatEther, http } from "viem";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { notifySubscriber } from "~~/utils/push-api-calls";

/**
 * Unified GemHistory component to display both sent and received events
 */
export const GemHistory = () => {
  const { address } = useAccount();
  const { pushNotificationSubscription } = useGlobalState(state => state);
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  type EventData = {
    from: string;
    to: string;
    value: bigint;
    blockNumber: bigint;
    date: string;
  };

  /*const simulatedEvents = [
    {
      from: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      to: address,
      value: 4000000000000000000,
      blockNumber: 5n,
      date: "Oct 20, 2023", // Modify the date here
    },
    {
      from: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      to: address,
      value: 14000000000000000000,
      blockNumber: 2n,
      date: "Oct 20, 2023", // Modify the date here
    },
    {
      from: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      to: address,
      value: 24000000000000000000,
      blockNumber: 5n,
      date: "Oct 20, 2023", // Modify the date here
    },
    {
      from: address,
      to: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      value: 6000000000000000000,
      blockNumber: 1n,
      date: "Oct 20, 2023", // Modify the date here
    },
    {
      from: address,
      to: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      value: 3000000000000000000,
      blockNumber: 8n,
      date: "Oct 20, 2023", // Modify the date here
    },
    {
      from: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      to: address,
      value: 3000000000000000000,
      blockNumber: 4n,
      date: "Oct 19, 2023", // Modify the date here
    },
    {
      from: address,
      to: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      value: 2000000000000000000,
      blockNumber: 3n,
      date: "Oct 19, 2023", // Modify the date here
    },
    {
      from: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      to: address,
      value: 1000000000000000000,
      blockNumber: 2n,
      date: "Oct 18, 2023", // Modify the date here
    },
    {
      from: address,
      to: "0xAACEaca8836A2624eE782b6365737CA181DB72Ae",
      value: 5000000000000000000,
      blockNumber: 1n,
      date: "Oct 18, 2023", // Modify the date here
    },
  ];*/

  const [transferEvents, setTransferEvents] = useState<EventData[]>([]);

  const { data: sentTransferEvents, isLoading: isLoadingSentEvents } = useScaffoldEventHistory({
    contractName: "EventGems",
    eventName: "Transfer",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
    filters: { from: address },
    blockData: true,
    receiptData: true,
    transactionData: true,
  });

  const { data: receivedTransferEvents, isLoading: isLoadingReceivedEvents } = useScaffoldEventHistory({
    contractName: "EventGems",
    eventName: "Transfer",
    fromBlock: process.env.NEXT_PUBLIC_DEPLOY_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) : 0n,
    filters: { to: address },
    blockData: true,
    receiptData: true,
    transactionData: true,
  });

  useScaffoldEventSubscriber({
    contractName: "EventGems",
    eventName: "Transfer",
    listener: async logs => {
      // Mark the function as async
      for (const log of logs) {
        // Use for loop to handle async/await inside map

        const { from, to, value } = log.args;
        const blockNumber = log.blockNumber;

        try {
          const block = await publicClient.getBlock({
            blockNumber: blockNumber,
          });

          // set date to the humanized block timestamp to show it in this format: Oct 20, 2023
          const date = new Date(Number(block.timestamp) * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          console.log("Received Transfer Event:", from, to, value, log);
          if (from && to && value) {
            if (from.toLowerCase() === address?.toLowerCase() || to.toLowerCase() === address?.toLowerCase()) {
              setTransferEvents(prevEvents => [{ from, to, value, blockNumber, date }, ...prevEvents]);
            }
            if (pushNotificationSubscription && to.toLowerCase() === address?.toLowerCase()) {
              notifySubscriber(pushNotificationSubscription, `You have received ${formatEther(value)} EventGems`);
            }
          }
        } catch (error) {
          console.error("Error fetching block:", error);
        }
      }
    },
  });

  useEffect(() => {
    if (!isLoadingSentEvents && !isLoadingReceivedEvents && (sentTransferEvents || receivedTransferEvents)) {
      const events: EventData[] = [];

      // Concatenate sent and received events
      const allEvents = [...(sentTransferEvents || []), ...(receivedTransferEvents || [])];

      for (const event of allEvents) {
        console.log("Event:", event);
        console.log("BlockNumber:", event.log.blockNumber);
        console.log("Timestamp:", event.block.timestamp);
        console.log("Args:", event.args);

        events.push({
          from: event.log.args.from,
          to: event.log.args.to,
          value: event.log.args.value,
          blockNumber: event.log.blockNumber,
          // set the date to the humanized block timestamp to shoW it in this format: Oct 20, 2023
          date: new Date(Number(event.block.timestamp) * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }

      events.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

      setTransferEvents(events);
    }
  }, [address, sentTransferEvents, receivedTransferEvents, isLoadingSentEvents, isLoadingReceivedEvents]);

  if (isLoadingSentEvents || isLoadingReceivedEvents) {
    return (
      <div className="text-center">
        <p className="font-bold">
          Loading history<span className=" loading-dots">...</span>
        </p>
      </div>
    );
  }

  // Create an object to group events by date
  // load eventsGroupedByDate with dummy data (simulatedEvents) to test output
  // const eventsGroupedByDate: { [key: string]: EventData[] } = simulatedEvents.reduce(
  const eventsGroupedByDate: { [key: string]: EventData[] } = transferEvents.reduce(
    (grouped: { [key: string]: EventData[] }, eventData) => {
      const date = eventData.date;

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(eventData);
      return grouped;
    },
    {},
  );

  return (
    <div className="flex flex-col gap-0">
      {Object.keys(eventsGroupedByDate).map(date => (
        <div key={date} className="bg-gray-200 p-0 rounded">
          {/* Display the date with light gray background */}
          <h2 className="font-bold text-gray-700 px-3 pt-3 pb-1">{date}</h2>
          {eventsGroupedByDate[date].map((eventData, index) => (
            <div className="bg-white p-2 rounded my-0 border border-gray-300" key={index}>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="">
                      {eventData.from.toLowerCase() === address?.toLowerCase() ? (
                        <span className="text-red-600">- {formatEther(eventData.value || 0n)} </span>
                      ) : (
                        <span className="text-green-600">+ {formatEther(eventData.value || 0n)} </span>
                      )}
                      {scaffoldConfig.tokenEmoji}{" "}
                      {eventData.from.toLowerCase() === address?.toLowerCase() ? "to" : "from"}
                    </span>
                    <span className="px-2 py-1">
                      <Address
                        address={
                          eventData.from.toLowerCase() === address?.toLowerCase() ? eventData.to : eventData.from
                        }
                        disableAddressLink={true}
                      />
                    </span>
                  </div>
                  <div className="flex gap-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
