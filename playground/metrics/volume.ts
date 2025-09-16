import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { volume, error } = await mailchannels.metrics.volume();

console.info(JSON.stringify({ volume, error }, null, 2));
