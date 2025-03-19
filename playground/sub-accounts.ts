import { MailChannels } from "../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
// await mailchannels.subAccounts.create("validhandle1234");
const { accounts } = await mailchannels.subAccounts.list();
// const { key } = await mailchannels.subAccounts.createApiKey("validhandle1234");
// const { password } = await mailchannels.subAccounts.createSmtpPassword("validhandle1234");

console.info(JSON.stringify(accounts, null, 2));
