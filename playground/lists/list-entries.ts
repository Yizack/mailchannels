import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { entries, error } = await mailchannels.lists.listEntries("safelist");

console.info(JSON.stringify({ entries, error }, null, 2));
