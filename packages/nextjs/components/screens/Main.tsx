import QRCode from "react-qr-code";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
// import { Address } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Main Screen
 */
export const Main = () => {
  const { address } = useAccount();

  const { writeAsync: mint, isMining } = useScaffoldContractWrite({
    contractName: "EventGems",
    functionName: "mint",
    args: [address, parseEther("10")],
  });

  const handleMint = async () => {
    try {
      // Call the mint function with the desired amount (10 gems)
      await mint();
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 pt-0">
      <div className="mb-4">
        <h2 className="font-bold">QR Code for your Address</h2>
      </div>
      {address && (
        <QRCode
          size={128}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={`${scaffoldConfig.liveUrl}/send#${address}`}
          viewBox={`0 0 256 256`}
        />
      )}
      <button onClick={handleMint} className={`btn btn-primary w-full mt-8 ${isMining ? "loading" : ""}`}>
        Mint 10 💎 Gems
      </button>
    </div>
  );
};
