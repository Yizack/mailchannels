import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { passwords, error } = await mailchannels.subAccounts.listSmtpPasswords("validhandle1234");

console.info(JSON.stringify({ passwords, error }, null, 2));
