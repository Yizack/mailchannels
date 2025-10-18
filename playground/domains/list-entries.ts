import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env;

if (!apiKey || !dkimDomain) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { entries, error } = await mailchannels.domains.listEntries(dkimDomain, "safelist");

console.info(JSON.stringify({ entries, error }, null, 2));
