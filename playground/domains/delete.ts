import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { success, error } = await mailchannels.domains.delete(dkimDomain);

console.info(JSON.stringify({ success, error }, null, 2));
