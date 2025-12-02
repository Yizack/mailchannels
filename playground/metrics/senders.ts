import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { senders, error } = await mailchannels.metrics.senders("campaigns");

console.info(JSON.stringify({ senders, error }, null, 2));
