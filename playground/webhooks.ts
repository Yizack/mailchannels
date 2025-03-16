import { MailChannels } from "../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
// await mailchannels.emails.enrollWebhook("");

const { webhooks } = await mailchannels.emails.getWebhooks();

console.info(JSON.stringify(webhooks, null, 2));
