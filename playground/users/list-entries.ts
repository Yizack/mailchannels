import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { entries, error } = await mailchannels.users.listEntries(`test@${dkimDomain}`, "safelist");

console.info(JSON.stringify({ entries, error }, null, 2));
