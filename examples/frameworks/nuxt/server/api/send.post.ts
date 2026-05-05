import { MailChannels } from "mailchannels-sdk";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const mailchannels = new MailChannels(config.mailchannels.apiKey);

  const { data, error } = await mailchannels.emails.send({
    from: "Name <from@example.com>",
    to: "to@example.com",
    subject: "Test email",
    html: "<p>Hello World</p>"
  });

  if (error) {
    throw createError({
      status: error.statusCode || 400,
      message: error.message
    });
  }

  return data;
});
