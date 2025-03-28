import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain,
  MAILCHANNELS_SUBSCRIPTION_HANDLE: subscriptionHandle,
  MAILCHANNELS_EMAIL: email
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { data, error } = await mailchannels.domains.provision({
  domain: dkimDomain,
  subscriptionHandle: subscriptionHandle,
  admins: [email]
});

console.info(JSON.stringify({ data, error }, null, 2));
