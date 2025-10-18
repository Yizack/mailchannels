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
const { key, error } = await mailchannels.emails.createDkimKey(dkimDomain, {
  selector: "mailchannels_test"
});

console.info(JSON.stringify({ key, error }, null, 2));
