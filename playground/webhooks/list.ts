import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { webhooks, error } = await mailchannels.webhooks.list();

console.info(JSON.stringify({ webhooks, error }, null, 2));
