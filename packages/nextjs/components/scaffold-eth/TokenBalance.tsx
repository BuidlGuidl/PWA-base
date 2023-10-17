import { formatEther } from "viem";
import scaffoldConfig from "~~/scaffold.config";

type TTokenBalanceProps = {
  amount?: bigint;
};

/**
 * Display Balance of token
 */
export const TokenBalance = ({ amount }: TTokenBalanceProps) => {
  return (
    <div className="w-full flex items-center justify-center">
      <>
        <span className="text-3xl font-bold mr-1">{scaffoldConfig.tokenEmoji}</span>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{amount !== undefined ? formatEther(amount) : null}</span>
        </div>
      </>
    </div>
  );
};
