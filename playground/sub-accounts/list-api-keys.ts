import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { keys, error } = await mailchannels.subAccounts.listApiKeys("validhandle1234");

console.info(JSON.stringify({ keys, error }, null, 2));
