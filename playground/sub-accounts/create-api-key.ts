import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { key, error } = await mailchannels.subAccounts.createApiKey("validhandle1234");

console.info(JSON.stringify({ key, error }, null, 2));
