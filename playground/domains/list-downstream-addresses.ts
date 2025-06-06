import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { records, error } = await mailchannels.domains.listDownstreamAddresses(dkimDomain);

console.info(JSON.stringify({ records, error }, null, 2));
