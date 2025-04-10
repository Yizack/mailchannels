import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import type { EmailsSendOptions, EmailsSendResponse } from "../types/emails/send";
import type { EmailsCheckDomainOptions, EmailsCheckDomainResponse } from "../types/emails/check-domain";
import type { EmailsCheckDomainApiResponse, EmailsCheckDomainPayload, EmailsSendContent, EmailsSendPayload } from "../types/emails/internal";
import { parseArrayRecipients, parseRecipient } from "../utils/recipients";
import { stripPemHeaders } from "../utils/helpers";

export class Emails {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Send an email using MailChannels Email API.
   * @param options - The email options to send.
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.emails.send({
   *   to: 'to@example.com',
   *   from: 'from@example.com',
   *   subject: 'Test',
   *   html: 'Test'
   * })
   * ```
   */
  async send (options: EmailsSendOptions, dryRun = false): Promise<EmailsSendResponse> {
    const { cc, bcc, from, to, html, text, mustaches, dkim } = options;

    const data: EmailsSendResponse = { success: false, error: null };

    const parsedFrom = parseRecipient(from);
    if (!parsedFrom || !parsedFrom.email) {
      data.error = "No sender provided. Use the `from` option to specify a sender";
      return data;
    }

    const parsedTo = parseArrayRecipients(to);
    if (!parsedTo || !parsedTo.length) {
      data.error = "No recipients provided. Use the `to` option to specify at least one recipient";
      return data;
    }

    if (!text && !html) {
      data.error = "No email content provided";
      return data;
    }

    const content: EmailsSendContent[] = [];
    const template_type = mustaches ? "mustache" : undefined;

    // Plain text must come first if provided
    if (text) content.push({ type: "text/plain", value: text, template_type });
    if (html) content.push({ type: "text/html", value: html, template_type });

    const payload: EmailsSendPayload = {
      attachments: options.attachments,
      personalizations: [{
        bcc: parseArrayRecipients(bcc),
        cc: parseArrayRecipients(cc),
        to: parsedTo,
        dkim_domain: dkim?.domain || undefined,
        dkim_private_key: dkim?.privateKey ? stripPemHeaders(dkim.privateKey) : undefined,
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

    const response = await this.mailchannels.post<{ data: string[] }>("/tx/v1/send", {
      query: { "dry-run": dryRun },
      body: payload,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature.",
          [ErrorCode.PayloadTooLarge]: "The total message size should not exceed 20MB. This includes the message itself, headers, and the combined size of any attachments."
        });
      }
    }).catch(() => null);

    data.data = response?.data;
    return data;
  }

  /**
   * Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This endpoint checks whether the domain is properly configured for secure email delivery.
   * @param options - The domain options to check.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { results } = await mailchannels.emails.checkDomain({
   *   dkim: [{
   *     domain: 'example.com',
   *     privateKey: 'your-private-key',
   *     selector: 'mailchannels'
   *   }],
   *   domain: 'example.com',
   *   senderId: 'sender-id'
   * })
   * ```
   */
  async checkDomain (options: EmailsCheckDomainOptions): Promise<EmailsCheckDomainResponse> {
    const { dkim, domain, senderId } = options;
    const dkimOptions = Array.isArray(dkim) ? dkim : [dkim];

    const data: EmailsCheckDomainResponse = { results: null, error: null };

    const payload: EmailsCheckDomainPayload = {
      dkim_settings: dkimOptions.map(({ domain, privateKey, selector }) => ({
        dkim_domain: domain,
        dkim_private_key: stripPemHeaders(privateKey),
        dkim_selector: selector
      })),
      domain,
      sender_id: senderId
    };

    const response = await this.mailchannels.post<EmailsCheckDomainApiResponse>("/tx/v1/check-domain", {
      body: payload,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.results = {
      dkim: response.check_results.dkim.map(({ dkim_domain, dkim_selector, reason, verdict }) => ({
        domain: dkim_domain,
        selector: dkim_selector,
        reason,
        verdict
      })),
      domainLockdown: response.check_results.domain_lockdown,
      spf: response.check_results.spf,
      references: response.references
    };
    return data;
  }
}
