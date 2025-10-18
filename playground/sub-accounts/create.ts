import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { account, error } = await mailchannels.subAccounts.create("My Company", "validhandle1234");

console.info(JSON.stringify({ account, error }, null, 2));
