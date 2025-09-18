import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { keys, error } = await mailchannels.emails.getDkimKeys(dkimDomain, {
  includeDnsRecord: true
});

console.info(JSON.stringify({ keys, error }, null, 2));
