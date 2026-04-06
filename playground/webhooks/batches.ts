import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env;

if (!apiKey) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { data, error } = await mailchannels.webhooks.batches({
  createdAfter: "2026-03-01",
  createdBefore: "2026-03-30",
  statuses: ["4xx"]
});

console.info(JSON.stringify({ data, error }, null, 2));
