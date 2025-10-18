import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { success, error } = await mailchannels.subAccounts.setLimit("validhandle1234", {
  sends: 1
});

console.info(JSON.stringify({ success, error }, null, 2));
