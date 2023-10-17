import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowsRightLeftIcon, HomeIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { AddressMain } from "~~/components/scaffold-eth/AddressMain";
import { TokenBalance } from "~~/components/scaffold-eth/TokenBalance";
import { History, Main, Send } from "~~/components/screens";
import { NotAllowed } from "~~/components/screens/NotAllowed";
import { isBurnerWalletloaded, useAutoConnect, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import ScanIcon from "~~/icons/ScanIcon";
import scaffoldConfig from "~~/scaffold.config";
import { useAppStore } from "~~/services/store/store";

const screens: Record<string, JSX.Element> = {
  main: <Main />,
  send: <Send />,
  history: <History />,
};

const Wallet: NextPage = () => {
  const setIsQrReaderOpen = useAppStore(state => state.setIsQrReaderOpen);
  useAutoConnect();

  const [isLoadingBurnerWallet, setIsLoadingBurnerWallet] = useState(true);

  const screen = useAppStore(state => state.screen);
  const setScreen = useAppStore(state => state.setScreen);

  const { address, isConnected } = useAccount();
  const { data: balance } = useScaffoldContractRead({
    contractName: "EventGems",
    functionName: "balanceOf",
    args: [address],
  });

  const screenRender = screens[screen];
  const isBurnerWalletSet = isBurnerWalletloaded();

  useEffect(() => {
    // Check if isBurnerWalletSet is true OR false
    if (isBurnerWalletSet || isBurnerWalletSet === false) {
      setIsLoadingBurnerWallet(false);
    }
  }, [isBurnerWalletSet]);

  if (!isBurnerWalletSet && !isLoadingBurnerWallet) {
    return <NotAllowed />;
  }

  return (
    <>
      <Head>
        <title>PWA Burner Wallet</title>
        <meta name="description" content="Event Wallet experience" />
      </Head>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="max-w-96 p-8">
          <div className="flex flex-col gap-2 pt-2">
            {!isConnected && isLoadingBurnerWallet ? (
              <div className="flex flex-col items-center justify-center my-16">
                <span className="animate-bounce text-8xl">{scaffoldConfig.tokenEmoji}</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6 gap-4">
                  <AddressMain address={address} disableAddressLink={true} />
                  <div className="flex gap-4 items-center">
                    <TokenBalance amount={balance || 0n} />
                  </div>
                </div>
                <div className="flex flex-row gap-6 justify-center mb-8">
                  <div className="flex flex-col items-center text-center">
                    <button
                      className={`${screen === "main" ? "bg-primary" : "bg-secondary"} text-white rounded-full p-3`}
                      onClick={() => setScreen("main")}
                    >
                      <HomeIcon className="w-8" />
                    </button>
                    <div className="text-xs text-gray-500 mt-1">Home</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <button
                      className={`${screen === "send" ? "bg-primary" : "bg-secondary"} text-white rounded-full p-3`}
                      onClick={() => setScreen("send")}
                    >
                      <PaperAirplaneIcon className="w-8" />
                    </button>
                    <div className="text-xs text-gray-500 mt-1">Send</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <button
                      className={`${screen === "history" ? "bg-primary" : "bg-secondary"} text-white rounded-full p-3`}
                      onClick={() => setScreen("history")}
                    >
                      <ArrowsRightLeftIcon className="w-8" />
                    </button>
                    <div className="text-xs text-gray-500 mt-1">History</div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <button
                      className={`text-white rounded-full p-3 bg-secondary`}
                      onClick={() => setIsQrReaderOpen(true)}
                    >
                      <ScanIcon width="2rem" height="2rem" className="w-8 text-white" />
                    </button>
                    <div className="text-xs text-gray-500 mt-1">Scan</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>{screenRender}</div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
