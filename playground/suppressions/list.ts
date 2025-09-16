import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { list, error } = await mailchannels.suppressions.list();

console.info(JSON.stringify({ list, error }, null, 2));
