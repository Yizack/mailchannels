import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey,
  MAILCHANNELS_DKIM_DOMAIN: dkimDomain,
  MAILCHANNELS_SUBSCRIPTION_HANDLE: subscriptionHandle,
  MAILCHANNELS_EMAIL: email,
  MAILCHANNELS_SECOND_DOMAIN: secondDomain
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { results, error } = await mailchannels.domains.bulkProvision({
  subscriptionHandle,
  overwrite: true
}, [
  {
    domain: dkimDomain,
    admins: [email]
  },
  {
    domain: secondDomain
  },
  {
    domain: "example.com"
  }
]);

console.info(JSON.stringify({ results, error }, null, 2));
