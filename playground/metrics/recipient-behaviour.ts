import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { behaviour, error } = await mailchannels.metrics.recipientBehaviour();

console.info(JSON.stringify({ behaviour, error }, null, 2));
