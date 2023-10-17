// qrHandler.ts
// import { NextRouter } from "next/router";
import { isAddress } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { TScreenPayload, TWalletScreens } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

// ToDo. Notification not working on external scanner / direct # url
export const redirectToScreenFromCode = (
  code: string,
  setScreen: (action: TWalletScreens, payload?: TScreenPayload | null | undefined) => void,
  // router: NextRouter,
  // reload = true,
) => {
  // Remove liveUrl from the result
  const [action, payload] = code.split("#");

  switch (action) {
    case "send":
      if (isAddress(payload)) {
        setScreen("send", { toAddress: payload });
        notification.info(
          <>
            <p className="mt-0">Address scanned!</p> <Address address={payload} />{" "}
          </>,
        );
      }
      break;
    default:
      notification.error(`Unknown QR ${action}`);
  }
};
