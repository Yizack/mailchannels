import { MailChannels } from "../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

const mailchannels = new MailChannels(apiKey!);
const response = await mailchannels.emails.send({
  from: "Name From <from@example.com>",
  to: "to@example.com",
  subject: "Test",
  html: "<p>Hello {{ world }}</p>",
  text: "Hello {{ world }}",
  mustaches: {
    world: "World"
  }
}, true);

console.info(response);
