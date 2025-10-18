import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { password, error } = await mailchannels.subAccounts.createSmtpPassword("validhandle1234");

console.info(JSON.stringify({ password, error }, null, 2));
