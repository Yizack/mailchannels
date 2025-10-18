import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { key, error } = await mailchannels.subAccounts.createApiKey("validhandle1234");

console.info(JSON.stringify({ key, error }, null, 2));
