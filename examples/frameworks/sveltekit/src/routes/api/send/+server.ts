import { json } from "@sveltejs/kit";
import { MailChannels } from "mailchannels-sdk";
import { MAILCHANNELS_API_KEY } from "$env/static/private";
import type { RequestHandler } from "./$types";

const mailchannels = new MailChannels(MAILCHANNELS_API_KEY);

export const POST: RequestHandler = async () => {
  const { data, error } = await mailchannels.emails.send({
    from: "Name <from@example.com>",
    to: "to@example.com",
    subject: "Test email",
    html: "<p>Hello World</p>"
  });

  if (error) {
    return json(error, { status: error.statusCode || 400 });
  }

  return json(data);
};
