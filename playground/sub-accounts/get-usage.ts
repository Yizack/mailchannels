import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { usage, error } = await mailchannels.subAccounts.getUsage("validhandle1234");

console.info(JSON.stringify({ usage, error }, null, 2));
