import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { limit, error } = await mailchannels.subAccounts.getLimit("validhandle1234");

console.info(JSON.stringify({ limit, error }, null, 2));
