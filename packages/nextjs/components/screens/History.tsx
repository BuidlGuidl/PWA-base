import { GemHistory } from "~~/components/screens/GemHistory";

/**
 * History Screen
 */
export const History = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold mb-0 mt-2">Gem History</h2>
      <div className="mt-0 w-full">
        <GemHistory />
      </div>
    </div>
  );
};
