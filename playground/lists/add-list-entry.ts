import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { entry, error } = await mailchannels.lists.addListEntry({
  listName: "safelist",
  item: "name@example.com"
});

console.info(JSON.stringify({ entry, error }, null, 2));
