import { MailChannels } from "../../src/mailchannels";

process.loadEnvFile();

const {
  MAILCHANNELS_API_KEY: apiKey
} = process.env as Record<string, string>;

const mailchannels = new MailChannels(apiKey);
const { user, error } = await mailchannels.users.create("test@example.com", {
  admin: true
});

console.info(JSON.stringify({ user, error }, null, 2));
