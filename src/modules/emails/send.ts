import type { MailChannelsClient } from "../../client";
import type { SendOptions, SendPayload, SendContent, SendResponse } from "../../types/emails/send";
import { parseRecipient, parseArrayRecipients } from "../../utils/recipients";

export class Send {
  constructor (protected mailchannels: MailChannelsClient) {}
  /**
   * Send an email using MailChannels Email API
   * @param options - The email options to send
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { success } = await mailchannels.emails.send({
   *   to: 'to@example.com',
   *   from: 'from@example.com',
   *   subject: 'Test',
   *   html: 'Test',
   * })
   * ```
   */
  async send (options: SendOptions, dryRun = false): Promise<SendResponse> {
    const { cc, bcc, from, to, html, text, mustaches, dkim } = options;

    const parsedFrom = parseRecipient(from);
    if (!parsedFrom || !parsedFrom.email) {
      throw new Error("No MailChannels sender provided. Use the `from` option to specify a sender");
    }

    const parsedTo = parseArrayRecipients(to);
    if (!parsedTo || !parsedTo.length) {
      throw new Error("No MailChannels recipients provided. Use the `to` option to specify at least one recipient");
    }

    const content: SendContent[] = [];
    const template_type = mustaches ? "mustache" : undefined;

    // Plain text must come first if provided
    if (text) content.push({ type: "text/plain", value: text, template_type });
    if (html) content.push({ type: "text/html", value: html, template_type });
    if (!content.length) {
      throw new Error("No email content provided");
    }

    const payload: SendPayload = {
      attachments: options.attachments,
      personalizations: [{
        bcc: parseArrayRecipients(bcc),
        cc: parseArrayRecipients(cc),
        to: parsedTo,
        dkim_domain: dkim?.domain || undefined,
        dkim_private_key: dkim?.privateKey || undefined,
        dkim_selector: dkim?.selector || undefined,
        dynamic_template_data: options.mustaches
      }],
      reply_to: parseRecipient(options.replyTo),
      from: parsedFrom,
      subject: options.subject,
      content,
      tracking_settings: options.tracking ? {
        click_tracking: options.tracking.click ? { enable: options.tracking.click } : undefined,
        open_tracking: options.tracking.open ? { enable: options.tracking.open } : undefined
      } : undefined
    };

    let success = true;

    const res = await this.mailchannels.post<{ data: string[] }>("/tx/v1/send", {
      query: { "dry-run": dryRun },
      body: payload,
      onResponseError: async ({ response }) => {
        success = false;
        if (response.status !== 500 && response.status !== 502) {
          console.error(response.status, response.statusText);
          return;
        }
        const body = await response.json() as { errors: string[] };
        if (body && Array.isArray(body.errors)) {
          console.error(response.status, response.statusText, body.errors);
        }
      }
    }).catch(() => null);

    return {
      success,
      payload,
      data: res?.data
    };
  }
}
