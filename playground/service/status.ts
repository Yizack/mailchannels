import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { success, error } = await mailchannels.service.status();

console.info(JSON.stringify({ success, error }, null, 2));
