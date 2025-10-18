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
const { success, error } = await mailchannels.emails.updateDkimKey(dkimDomain, {
  selector: "mailchannels_test",
  status: "retired"
});

console.info(JSON.stringify({ success, error }, null, 2));
