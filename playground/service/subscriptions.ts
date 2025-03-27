import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { subscriptions, error } = await mailchannels.service.subscriptions();

console.info(JSON.stringify({ subscriptions, error }, null, 2));
