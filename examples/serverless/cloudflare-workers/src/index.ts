/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Emails, MailChannelsClient } from "mailchannels-sdk";

export default {
  async fetch (request, env): Promise<Response> {
    const mailchannels = new MailChannelsClient(env.MAILCHANNELS_API_KEY);
    const emails = new Emails(mailchannels);

    const { data, error } = await emails.send({
      from: "Name <from@example.com>",
      to: "to@example.com",
      subject: "Test email",
      html: "<p>Hello World</p>"
    });

    if (error) {
      return Response.json(error, { status: error.statusCode || 500 });
    }

    return Response.json(data, { status: 200 });
  }
} satisfies ExportedHandler<Env>;
