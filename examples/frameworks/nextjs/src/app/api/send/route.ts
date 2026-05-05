import { MailChannels } from "mailchannels-sdk";

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY as string);

export async function POST () {
  const { data, error } = await mailchannels.emails.send({
    from: "Name <from@example.com>",
    to: "to@example.com",
    subject: "Test email",
    html: "<p>Hello World</p>"
  });

  if (error) {
    return Response.json(error, {
      status: error.statusCode || 400
    });
  }

  return Response.json(data);
}
