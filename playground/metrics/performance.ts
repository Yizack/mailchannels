import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { performance, error } = await mailchannels.metrics.performance();

console.info(JSON.stringify({ performance, error }, null, 2));
