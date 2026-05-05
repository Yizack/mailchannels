import { MailChannels } from "mailchannels-sdk";

const mailchannels = new MailChannels(process.env.MAILCHANNELS_API_KEY as string);

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/send": {
      POST: async () => {
        const { data, error } = await mailchannels.emails.send({
          from: "Name <from@example.com>",
          to: "to@example.com",
          subject: "Test email",
          html: "<p>Hello World</p>"
        });

        if (error) {
          return Response.json(error, { status: error.statusCode || 500 });
        }

        return Response.json(data);
      }
    },
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
    "/*": () => new Response("Not found", { status: 404 })
  }
});

console.info(`Listening on http://localhost:${server.port} ...`);
