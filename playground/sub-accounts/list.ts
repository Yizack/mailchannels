import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { accounts, error } = await mailchannels.subAccounts.list();

console.info(JSON.stringify({ accounts, error }, null, 2));
