import { MailChannels } from "../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);

// await mailchannels.emails.enrollWebhook("https://example.com/webhook");
const { webhooks } = await mailchannels.emails.listWebhooks();
// await mailchannels.emails.deleteWebhooks();
// const { key } = await mailchannels.emails.getSigningKey("key-id");

console.info(JSON.stringify(webhooks, null, 2));
