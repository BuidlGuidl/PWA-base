import { NextApiRequest, NextApiResponse } from "next";
import webpush, { PushSubscription } from "web-push";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!req.body || !req.body.subscription || !req.body.message) {
    res.status(400).json({
      error: {
        id: "invalid-request",
        message: "Invalid request. The request must include a valid subscription and message.",
      },
    });
    return;
  }

  const { subscription, message } = req.body;

  try {
    await triggerPush(subscription, message);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ message: "Error while sending notification" });
  }
}

const triggerPush = async (subscription: PushSubscription, dataToSend: string) => {
  try {
    await webpush.sendNotification(subscription, dataToSend);
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log("Subscription has expired or is no longer valid.");
      // Handle subscription cleanup if needed.
    } else {
      console.log("Subscription is no longer valid: ", err);
      throw err;
    }
  }
};
