import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { success, data, error } = await mailchannels.emails.send({
  from: "Name From <from@example.com>",
  to: "to@example.com",
  subject: "Test",
  html: "<p>Hello {{ world }}</p>",
  text: "Hello {{ world }}",
  mustaches: {
    world: "World"
  }
}, true);

console.info(JSON.stringify({ success, data, error }, null, 2));
