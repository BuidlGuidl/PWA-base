import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Unified GemHistory component to display both sent and received events
 */
export const GemHistory = () => {
  const { address } = useAccount();

  type EventData = {
    from: string;
    to: string;
    value: bigint;
  };

  const [transferEvents, setTransferEvents] = useState<EventData[]>([]);

  const { data: sentTransferEvents, isLoading: isLoadingSentEvents } = useScaffoldEventHistory({
    contractName: "EventGems",
    eventName: "Transfer",
    fromBlock: 0n,
    filters: { from: address }, // Fetch sent events
  });

  const { data: receivedTransferEvents, isLoading: isLoadingReceivedEvents } = useScaffoldEventHistory({
    contractName: "EventGems",
    eventName: "Transfer",
    fromBlock: 0n,
    filters: { to: address }, // Fetch received events
  });

  useScaffoldEventSubscriber({
    contractName: "EventGems",
    eventName: "Transfer",
    listener: logs => {
      logs.map(log => {
        const { from, to, value } = log.args;
        console.log("Received Transfer Event:", from, to, value);
        if (from && to && value) {
          if (from.toLowerCase() === address?.toLowerCase() || to.toLowerCase() === address?.toLowerCase()) {
            setTransferEvents(prevEvents => [{ from, to, value }, ...prevEvents]);
          }
        }
      });
    },
  });

  useEffect(() => {
    if (!isLoadingSentEvents && !isLoadingReceivedEvents && (sentTransferEvents || receivedTransferEvents)) {
      const events: EventData[] = [];
      for (let i = 0; i < (sentTransferEvents?.length || 0); i++) {
        const event = sentTransferEvents?.[i];
        if (event) {
          const eventData = event.args;
          events.push({ from: eventData.from, to: eventData.to, value: eventData.value });
        }
      }

      for (let i = 0; i < (receivedTransferEvents?.length || 0); i++) {
        const event = receivedTransferEvents?.[i];
        if (event) {
          const eventData = event.args;
          events.push({ from: eventData.from, to: eventData.to, value: eventData.value });
        }
      }
      setTransferEvents(events);
    }
  }, [
    address,
    transferEvents,
    sentTransferEvents,
    receivedTransferEvents,
    isLoadingSentEvents,
    isLoadingReceivedEvents,
  ]);

  if (isLoadingSentEvents || isLoadingReceivedEvents) {
    return (
      <div className="text-center">
        <p className="font-bold">
          Loading history<span className=" loading-dots">...</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {transferEvents.map((eventData, index) => (
        <div className="flex flex-col gap-2 animate-fadeIn" key={index}>
          <div className="flex gap-2 mb-4 items-center">
            <div className="text-2xl">{scaffoldConfig.tokenEmoji}</div>
            <div className="flex flex-col">
              <span>
                you{" "}
                <span className="font-bold">
                  {eventData.from.toLowerCase() === address?.toLowerCase() ? "sent" : "received"}
                </span>{" "}
                {formatEther(eventData.value || 0n)}
              </span>
              <div className="flex gap-2">
                {eventData.from.toLowerCase() === address?.toLowerCase() ? "to" : "from"}
                <Address
                  address={eventData.from.toLowerCase() === address?.toLowerCase() ? eventData.to : eventData.from}
                  disableAddressLink={true}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
