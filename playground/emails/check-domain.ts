import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain,
  MAILCHANNELS_DKIM_SELECTOR: dkimSelector,
  MAILCHANNELS_DKIM_PRIVATE_KEY: dkimPrivateKey,
  MAILCHANNELS_SENDER_ID: senderId
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { results } = await mailchannels.emails.checkDomain({
  domain: dkimDomain,
  dkim: {
    domain: dkimDomain,
    selector: dkimSelector,
    privateKey: dkimPrivateKey
  },
  senderId: senderId
});

console.info(JSON.stringify(results, null, 2));
