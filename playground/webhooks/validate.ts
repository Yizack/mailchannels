import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { allPassed, results, error } = await mailchannels.webhooks.validate();

console.info(JSON.stringify({ allPassed, results, error }, null, 2));
