import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { success, error } = await mailchannels.suppressions.create({
  addToSubAccounts: false,
  entries: [
    {
      notes: "test",
      recipient: "name@example.com",
      types: ["transactional"]
    }
  ]
});

console.info(JSON.stringify({ success, error }, null, 2));
