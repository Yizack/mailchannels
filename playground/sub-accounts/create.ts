import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { account, error } = await mailchannels.subAccounts.create("validhandle1234");

console.info(JSON.stringify({ account, error }, null, 2));
