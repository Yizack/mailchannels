import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { entry, error } = await mailchannels.users.addListEntry(`test@${dkimDomain}`, {
  listName: "safelist",
  item: "name@example.com"
});

console.info(JSON.stringify({ entry, error }, null, 2));
