import { MailChannels } from "../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);

// await mailchannels.webhooks.enroll("https://example.com/webhook");
const { webhooks } = await mailchannels.webhooks.list();
// await mailchannels.webhooks.delete();
// const { key } = await mailchannels.webhooks.getSigningKey("key-id");

console.info(JSON.stringify(webhooks, null, 2));
