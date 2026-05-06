
import { ActionError, defineAction } from "astro:actions";
import { MailChannels } from "mailchannels-sdk";

const mailchannels = new MailChannels(import.meta.env.MAILCHANNELS_API_KEY);

export default defineAction({
  accept: "json",
  handler: async () => {
    const { data, error } = await mailchannels.emails.send({
      from: "Name <from@example.com>",
      to: "to@example.com",
      subject: "Test email",
      html: "<p>Hello World</p>"
    });

    if (error) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: error.message
      });
    }

    return data;
  }
});
