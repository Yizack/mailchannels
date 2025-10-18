import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_API_KEY_2: apiKey2,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain
} = process.env;

if (!apiKey || !dkimDomain || !apiKey2) {
  throw new Error("Missing environment variables");
}

const mailchannels = new MailChannels(apiKey);
const { success, error } = await mailchannels.domains.updateApiKey(dkimDomain, apiKey2);

console.info(JSON.stringify({ success, error }, null, 2));
