import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain,
  MAILCHANNELS_DKIM_SELECTOR: dkimSelector,
  MAILCHANNELS_DKIM_PRIVATE_KEY: dkimPrivateKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { data, error } = await mailchannels.emails.sendAsync({
  from: "Name From <from@example.com>",
  to: "to@example.com",
  subject: "Test Email Async",
  html: "<p>Hello {{ world }}</p>",
  text: "Hello {{ world }}",
  dkim: {
    domain: dkimDomain!,
    selector: dkimSelector!,
    privateKey: dkimPrivateKey!
  },
  mustaches: {
    world: "World"
  }
});

console.info(JSON.stringify({ data, error }, null, 2));
