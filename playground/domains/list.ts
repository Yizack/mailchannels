import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { domains, total, error } = await mailchannels.domains.list();

console.info(JSON.stringify({ domains, total, error }, null, 2));
