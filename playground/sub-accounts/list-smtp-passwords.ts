import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { passwords } = await mailchannels.subAccounts.listSmtpPasswords("validhandle1234");

console.info(JSON.stringify(passwords, null, 2));
