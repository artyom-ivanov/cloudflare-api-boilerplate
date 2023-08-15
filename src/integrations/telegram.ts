import { TG_BOT_TOKEN, TG_CHANNEL_ID } from "../config";

export const notify = async (text: string) => {
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHANNEL_ID,
        text,
      }),
    });
  } catch (e) {
    // console.error(e);
  }
};
