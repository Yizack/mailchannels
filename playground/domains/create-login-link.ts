import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { link, error } = await mailchannels.domains.createLoginLink(dkimDomain);

console.info(JSON.stringify({ link, error }, null, 2));
