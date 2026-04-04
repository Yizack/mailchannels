import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import { parseArrayRecipients, parseRecipient } from "../utils/recipients";
import { stripPemHeaders } from "../utils/helpers";
import type { SuccessResponse } from "../types/success-response";
import type { EmailsCheckDomainApiResponse, EmailsCheckDomainPayload, EmailsCreateDkimKeyApiResponse, EmailsCreateDkimKeyPayload, EmailsGetDkimKeysPayload, EmailsRotateDkimKeyApiResponse, EmailsSendApiResponse, EmailsSendAsyncApiResponse, EmailsSendContent, EmailsSendPayload } from "../types/emails/internal";
import type { EmailsSendDkim, EmailsSendOptions, EmailsSendPersonalization, EmailsSendResponse } from "../types/emails/send";
import type { EmailsSendAsyncResponse } from "../types/emails/send-async";
import type { EmailsCheckDomainOptions, EmailsCheckDomainResponse } from "../types/emails/check-domain";
import type { EmailsCreateDkimKeyOptions, EmailsCreateDkimKeyResponse, EmailsDkimKey } from "../types/emails/create-dkim-key";
import type { EmailsGetDkimKeysOptions, EmailsGetDkimKeysResponse } from "../types/emails/get-dkim-keys";
import type { EmailsRotateDkimKeyOptions, EmailsRotateDkimKeyResponse } from "../types/emails/rotate-dkim-key";
import type { EmailsUpdateDkimKeyOptions } from "../types/emails/update-dkim-key";

const mapDkimKey = (key: EmailsCreateDkimKeyApiResponse): EmailsDkimKey => ({
  algorithm: key.algorithm,
  createdAt: key.created_at,
  dnsRecords: key.dkim_dns_records,
  domain: key.domain,
  gracePeriodExpiresAt: key.gracePeriodExpiresAt ?? null,
  length: key.key_length,
  publicKey: key.public_key,
  retiresAt: key.retiresAt ?? null,
  selector: key.selector,
  status: key.status,
  statusModifiedAt: key.status_modified_at
});

const mapDkim = (dkim?: EmailsSendDkim) => ({
  dkim_domain: dkim?.domain,
  dkim_private_key: dkim?.privateKey ? stripPemHeaders(dkim.privateKey) : undefined,
  dkim_selector: dkim?.selector
});

const mapPersonalization = (personalization: EmailsSendPersonalization, index: number) => {
  const to = parseArrayRecipients(personalization.to);
  if (!to || !to.length) {
    return `Personalization at index ${index} must include at least one recipient in the \`to\` field.`;
  }

  return {
    bcc: parseArrayRecipients(personalization.bcc),
    cc: parseArrayRecipients(personalization.cc),
    ...mapDkim(personalization.dkim),
    dynamic_template_data: personalization.mustaches,
    envelope_from: parseRecipient(personalization.envelopeFrom),
    from: parseRecipient(personalization.from),
    headers: personalization.headers,
    reply_to: parseRecipient(personalization.replyTo),
    subject: personalization.subject,
    to
  };
};

const buildSendPayload = (options: EmailsSendOptions): EmailsSendPayload | string => {
  const { from, html, text } = options;

  const parsedFrom = parseRecipient(from);
  if (!parsedFrom || !parsedFrom.email) {
    return "No sender provided. Use the `from` option to specify a sender";
  }

  if (!text && !html) {
    return "No email content provided";
  }

  let personalizations: EmailsSendPayload["personalizations"];
  if (options.personalizations) {
    if (!options.personalizations.length) {
      return "At least one personalization must be provided.";
    }

    if (options.personalizations.length > 1000) {
      return "The maximum number of personalizations is 1000.";
    }

    const mapped = options.personalizations.map(mapPersonalization);
    const error = mapped.find((item): item is string => typeof item === "string");
    if (error) return error;
    personalizations = mapped as EmailsSendPayload["personalizations"];
  }
  else {
    const parsedTo = parseArrayRecipients(options.to);
    if (!parsedTo || !parsedTo.length) {
      return "No recipients provided. Use the `to` option to specify at least one recipient";
    }

    personalizations = [{
      bcc: parseArrayRecipients(options.bcc),
      cc: parseArrayRecipients(options.cc),
      dynamic_template_data: options.mustaches,
      to: parsedTo
    }];
  }

  const content: EmailsSendContent[] = [];
  const hasTemplates = Boolean(options.mustaches) || Boolean(options.personalizations?.some(personalization => personalization.mustaches));
  const template_type = hasTemplates ? "mustache" : undefined;

  if (text) content.push({ type: "text/plain", value: text, template_type });
  if (html) content.push({ type: "text/html", value: html, template_type });

  return {
    attachments: options.attachments,
    campaign_id: options.campaignId,
    ...mapDkim(options.dkim),
    envelope_from: parseRecipient(options.envelopeFrom),
    personalizations,
    headers: options.headers,
    reply_to: parseRecipient(options.replyTo),
    from: parsedFrom,
    subject: options.subject,
    content,
    tracking_settings: options.tracking ? {
      click_tracking: typeof options.tracking.click === "boolean" ? { enable: options.tracking.click } : undefined,
      open_tracking: typeof options.tracking.open === "boolean" ? { enable: options.tracking.open } : undefined
    } : undefined,
    transactional: options.transactional
  };
};

export class Emails {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Send an email using MailChannels Email API.
   * @param options - The email options to send.
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, data } = await mailchannels.emails.send({
   *   to: 'to@example.com',
   *   from: 'from@example.com',
   *   subject: 'Test',
   *   html: 'Test'
   * })
   * ```
   */
  async send (options: EmailsSendOptions, dryRun = false): Promise<EmailsSendResponse> {
    const data: EmailsSendResponse = { success: false, data: null, error: null };
    const payload = buildSendPayload(options);
    if (typeof payload === "string") {
      data.error = payload;
      return data;
    }

    const response = await this.mailchannels.post<EmailsSendApiResponse>("/tx/v1/send", {
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
          [ErrorCode.PayloadTooLarge]: "The total message size should not exceed 30MB. This includes the message itself, headers, and the combined size of any attachments."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.data = {
      rendered: response.data,
      requestId: response.request_id,
      results: response.results?.map(result => ({
        index: result.index,
        messageId: result.message_id,
        reason: result.reason,
        status: result.status
      }))
    };

    return data;
  }

  /**
   * Queue an email for asynchronous delivery processing.
   * @param options - The email options to queue.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, data } = await mailchannels.emails.sendAsync({
   *   to: 'to@example.com',
   *   from: 'from@example.com',
   *   subject: 'Queued email',
   *   html: 'Test'
   * })
   * ```
   */
  async sendAsync (options: EmailsSendOptions): Promise<EmailsSendAsyncResponse> {
    const data: EmailsSendAsyncResponse = { success: false, data: null, error: null };
    const payload = buildSendPayload(options);
    if (typeof payload === "string") {
      data.error = payload;
      return data;
    }

    const response = await this.mailchannels.post<EmailsSendAsyncApiResponse>("/tx/v1/send-async", {
      body: payload,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature.",
          [ErrorCode.PayloadTooLarge]: "The total message size should not exceed 30MB. This includes the message itself, headers, and the combined size of any attachments."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.data = {
      queuedAt: response.queued_at,
      requestId: response.request_id
    };

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
    const dkimOptions = dkim ? Array.isArray(dkim) ? dkim: [dkim]: undefined;

    const data: EmailsCheckDomainResponse = { results: null, error: null };

    const payload: EmailsCheckDomainPayload = {
      dkim_settings: dkimOptions?.map(({ domain, privateKey, selector }) => ({
        dkim_domain: domain,
        dkim_private_key: privateKey ? stripPemHeaders(privateKey) : undefined,
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
      dkim: response.check_results.dkim.map(dkimResults => ({
        domain: dkimResults.dkim_domain,
        keyStatus: dkimResults.dkim_key_status,
        selector: dkimResults.dkim_selector,
        reason: dkimResults.reason,
        verdict: dkimResults.verdict
      })),
      domainLockdown: response.check_results.domain_lockdown,
      senderDomain: response.check_results.sender_domain,
      spf: response.check_results.spf,
      references: response.references
    };
    return data;
  }

  /**
   * Create a DKIM key pair for a specified domain and selector using the specified algorithm and key length, for the current customer.
   * @param domain - The domain to create the DKIM key for.
   * @param options - DKIM key creation options.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { key, error } = await mailchannels.emails.createDkimKey('example.com', {
   *   selector: 'mailchannels'
   * })
   * ```
   */
  async createDkimKey (domain: string, options: EmailsCreateDkimKeyOptions): Promise<EmailsCreateDkimKeyResponse> {
    const data: EmailsCreateDkimKeyResponse = { key: null, error: null };

    if (!options.selector || options.selector.length > 63) {
      data.error = "Selector must be between 1 and 63 characters.";
    }

    if (data.error) return data;

    const payload: EmailsCreateDkimKeyPayload = {
      algorithm: options.algorithm,
      key_length: options.length,
      selector: options.selector
    };

    const response = await this.mailchannels.post<EmailsCreateDkimKeyApiResponse>(`/tx/v1/domains/${domain}/dkim-keys`, {
      body: payload,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Conflict]: "Key pair already created for customer_handle, domain, and selector."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.key = mapDkimKey(response);

    return data;
  }

  /**
   * Search for DKIM keys by customer handle and domain, with optional filters. If selector is provided, at most one key will be returned.
   * @param domain - The domain to search DKIM keys for.
   * @param options - The options to filter DKIM keys by.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { keys } = await mailchannels.getDkimKeys('example.com', {
   *   includeDnsRecord: true
   * })
   * ```
   */
  async getDkimKeys (domain: string, options?: EmailsGetDkimKeysOptions): Promise<EmailsGetDkimKeysResponse> {
    const data: EmailsGetDkimKeysResponse = { keys: [], error: null };

    if (options?.selector && options.selector.length > 63) {
      data.error = "Selector must be a maximum of 63 characters.";
      return data;
    }
    if (typeof options?.limit === "number" && (options.limit < 1 || options.limit > 100)) {
      data.error = "Limit must be between 1 and 100.";
      return data;
    }
    if (typeof options?.offset === "number" && options.offset < 0) {
      data.error = "Offset value is invalid. Only positive values are allowed.";
      return data;
    }

    const payload: EmailsGetDkimKeysPayload = {
      selector: options?.selector,
      status: options?.status,
      offset: options?.offset,
      limit: options?.limit,
      include_dns_record: options?.includeDnsRecord
    };

    const response = await this.mailchannels.get<{ keys: EmailsCreateDkimKeyApiResponse[] }>(`/tx/v1/domains/${domain}/dkim-keys`, {
      query: payload,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.keys = response.keys.map(mapDkimKey);

    return data;
  }

  /**
   * Rotate an active DKIM key pair by creating a replacement key with a new selector.
   * @param domain - The domain the DKIM key belongs to.
   * @param options - The rotation options.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { newKey, rotatedKey } = await mailchannels.emails.rotateDkimKey('example.com', {
   *   selector: 'mailchannels',
   *   newSelector: 'mailchannels-next'
   * })
   * ```
   */
  async rotateDkimKey (domain: string, options: EmailsRotateDkimKeyOptions): Promise<EmailsRotateDkimKeyResponse> {
    const data: EmailsRotateDkimKeyResponse = { newKey: null, rotatedKey: null, error: null };

    if (!options.selector || options.selector.length > 63) {
      data.error = "Selector must be between 1 and 63 characters.";
      return data;
    }

    if (!options.newSelector || options.newSelector.length > 63) {
      data.error = "New selector must be between 1 and 63 characters.";
      return data;
    }

    const response = await this.mailchannels.post<EmailsRotateDkimKeyApiResponse>(`/tx/v1/domains/${domain}/dkim-keys/${options.selector}/rotate`, {
      body: {
        new_key: {
          selector: options.newSelector
        }
      },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "Specified key pair not found.",
          [ErrorCode.Conflict]: "Key pair already created for domain, and provided new key selector."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.newKey = mapDkimKey(response.new_key);
    data.rotatedKey = mapDkimKey(response.rotated_key);

    return data;
  }

  /**
   * Update fields of an existing DKIM key pair for the specified domain and selector, for the current customer. Currently, only the `status` field can be updated.
   * @param domain - The domain the DKIM key belongs to.
   * @param options - The options to update the DKIM key.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.emails.updateDkimKey('example.com', {
   *   selector: 'mailchannels',
   *   status: 'retired'
   * })
   */
  async updateDkimKey (domain: string, options: EmailsUpdateDkimKeyOptions): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    if (!options.selector || options.selector.length > 63) {
      data.error = "Selector must be between 1 and 63 characters.";
      return data;
    }

    const payload = {
      status: options.status
    };

    try {
      await this.mailchannels.patch(`/tx/v1/domains/${domain}/dkim-keys/${options.selector}`, {
        body: payload,
        ignoreResponseError: true,
        onResponse: async ({ response }) => {
          if (response.ok) {
            data.success = true;
            return;
          }
          data.error = getStatusError(response, {
            [ErrorCode.BadRequest]: "Bad Request.",
            [ErrorCode.NotFound]: "Specified key pair not found, or the DKIM domain or selector path parameter is missing."
          });
        }
      });
    }
    catch (error) {
      if (!data.error) {
        data.error = error instanceof Error ? error.message : "Failed to update DKIM key.";
      }
    }

    return data;
  }
}
