/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from "axios";

type LogParams = {
  type?: "new-subscription" | "log";
  message?: any;
};

const logTypeToEnv = {
  "new-subscription": process.env.DISCORD_NEW_SUBSCRIPTION_WEBHOOK,
  log: process.env.DISCORD_LOG_WEBHOOK,
};

export const log = async ({ message, type = "log" }: LogParams) => {
  // if (process.env.NODE_ENV === "development")
  //   console.log(`[${type.toUpperCase()}] ${JSON.stringify(message, null, 2)}`);

  const webhook = logTypeToEnv[type];

  console.log({ webhook, type });

  if (!webhook) return;

  try {
    return await axios.post(webhook, message);
  } catch (err) {
    console.log(err);
  }
};
