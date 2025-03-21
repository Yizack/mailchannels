import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { id, password } = await mailchannels.subAccounts.createSmtpPassword("validhandle1234");

console.info(id, password);
