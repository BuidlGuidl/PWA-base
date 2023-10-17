import QRCode from "react-qr-code";
import { useAccount } from "wagmi";
// import { Address } from "~~/components/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Main Screen
 */
export const Main = () => {
  const { address } = useAccount();

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
    </div>
  );
};
