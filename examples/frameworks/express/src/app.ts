import express from "express";
import type { Request, Response } from "express";
import { MailChannels } from "mailchannels-sdk";

process.loadEnvFile();

const app = express();
const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY as string);

app.post("/send", async (req: Request, res: Response) => {
  const { data, error } = await mailchannels.emails.send({
    from: "Name <from@example.com>",
    to: "to@example.com",
    subject: "Test email",
    html: "<p>Hello World</p>"
  });

  if (error) {
    return res.status(error.statusCode || 400).json(error);
  }

  res.status(200).json(data);
});

app.listen(3000, () => {
  console.info("Listening on http://localhost:3000");
});
