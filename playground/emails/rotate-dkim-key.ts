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
const { keys, error } = await mailchannels.emails.rotateDkimKey(dkimDomain, "mailchannels_test", {
  newKey: {
    selector: "mc_test"
  }
});

console.info(JSON.stringify({ keys, error }, null, 2));
