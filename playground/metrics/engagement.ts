import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { engagement, error } = await mailchannels.metrics.engagement();

console.info(JSON.stringify({ engagement, error }, null, 2));
