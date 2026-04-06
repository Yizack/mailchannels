import type { MailChannelsClient } from "../client";
import { ErrorCode, createError, getResultError, getStatusError, validatePagination } from "../utils/errors";
import { parseArrayRecipients, parseRecipient } from "../utils/recipients";
import { clean, stripPemHeaders } from "../utils/helpers";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
import type { EmailsCheckDomainApiResponse, EmailsCheckDomainPayload, EmailsCreateDkimKeyApiResponse, EmailsCreateDkimKeyPayload, EmailsGetDkimKeysPayload, EmailsRotateDkimKeyApiResponse, EmailsSendApiResponse, EmailsSendAsyncApiResponse, EmailsSendContent, EmailsSendPayload } from "../types/emails/internal";
import type { EmailsSendDkim, EmailsSendOptions, EmailsSendPersonalization, EmailsSendResponse } from "../types/emails/send";
import type { EmailsSendAsyncResponse } from "../types/emails/send-async";
import type { EmailsCheckDomainOptions, EmailsCheckDomainResponse } from "../types/emails/check-domain";
import type { EmailsCreateDkimKeyOptions, EmailsCreateDkimKeyResponse, EmailsDkimKey } from "../types/emails/create-dkim-key";
import type { EmailsGetDkimKeysOptions, EmailsGetDkimKeysResponse } from "../types/emails/get-dkim-keys";
import type { EmailsUpdateDkimKeyOptions } from "../types/emails/update-dkim-key";
import type { EmailsRotateDkimKeyOptions, EmailsRotateDkimKeyResponse } from "../types/emails/rotate-dkim-key";

const RESERVED_HEADER_NAMES = new Set([
  "authentication-results",
  "bcc",
  "cc",
  "content-transfer-encoding",
  "content-type",
  "dkim-signature",
  "from",
  "message-id",
  "received",
  "reply-to",
  "subject",
  "to"
]);

const getRecipientCount = (recipients?: EmailsSendPayload["personalizations"][number]["to"]) => recipients?.length || 0;

const validateHeaderMap = (headers: Record<string, string> | undefined, label: string) => {
  if (!headers) return null;

  const seenHeaders = new Set<string>();
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (typeof headerValue !== "string") {
      return `${label} header '${headerName}' must have a string value.`;
    }

    const normalizedHeaderName = headerName.toLowerCase();
    if (seenHeaders.has(normalizedHeaderName)) {
      return `${label} headers must be unique when compared case-insensitively.`;
    }

    if (RESERVED_HEADER_NAMES.has(normalizedHeaderName)) {
      return `${label} headers cannot include the reserved header '${headerName}'.`;
    }

    seenHeaders.add(normalizedHeaderName);
  }

  return null;
};

const validateSendDkim = (dkim: EmailsSendDkim | undefined, label: string) => {
  if (!dkim) return null;

  if (dkim.domain && !dkim.selector) {
    return `${label} DKIM domain requires a selector.`;
  }

  if (dkim.privateKey && (!dkim.domain || !dkim.selector)) {
    return `${label} DKIM privateKey requires both a domain and selector.`;
  }

  return null;
};

const mapDkimKey = (key: EmailsCreateDkimKeyApiResponse): EmailsDkimKey => ({
  algorithm: key.algorithm,
  createdAt: key.created_at,
  dnsRecords: key.dkim_dns_records,
  domain: key.domain,
  gracePeriodExpiresAt: key.gracePeriodExpiresAt,
  length: key.key_length,
  publicKey: key.public_key,
  retiresAt: key.retiresAt,
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

  if (to.length > 1000) {
    return `Personalization at index ${index} cannot include more than 1000 \`to\` recipients.`;
  }

  const cc = parseArrayRecipients(personalization.cc);
  if (cc && cc.length > 1000) {
    return `Personalization at index ${index} cannot include more than 1000 \`cc\` recipients.`;
  }

  const bcc = parseArrayRecipients(personalization.bcc);
  if (bcc && bcc.length > 1000) {
    return `Personalization at index ${index} cannot include more than 1000 \`bcc\` recipients.`;
  }

  const headerError = validateHeaderMap(personalization.headers, `Personalization at index ${index}`);
  if (headerError) {
    return headerError;
  }

  const dkimError = validateSendDkim(personalization.dkim, `Personalization at index ${index}`);
  if (dkimError) {
    return dkimError;
  }

  return {
    bcc,
    cc,
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

  if (options.attachments && options.attachments.length > 1000) {
    return "The maximum number of attachments is 1000.";
  }

  if (options.campaignId && (options.campaignId.length > 48 || /\s/.test(options.campaignId))) {
    return "campaignId must be 48 characters or fewer and must not contain spaces.";
  }

  const rootHeaderError = validateHeaderMap(options.headers, "Root");
  if (rootHeaderError) {
    return rootHeaderError;
  }

  const rootDkimError = validateSendDkim(options.dkim, "Root");
  if (rootDkimError) {
    return rootDkimError;
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

    if (parsedTo.length > 1000) {
      return "The maximum number of `to` recipients is 1000.";
    }

    const parsedCc = parseArrayRecipients(options.cc);
    if (parsedCc && parsedCc.length > 1000) {
      return "The maximum number of `cc` recipients is 1000.";
    }

    const parsedBcc = parseArrayRecipients(options.bcc);
    if (parsedBcc && parsedBcc.length > 1000) {
      return "The maximum number of `bcc` recipients is 1000.";
    }

    personalizations = [{
      bcc: parsedBcc,
      cc: parsedCc,
      dynamic_template_data: options.mustaches,
      to: parsedTo
    }];
  }

  if (options.transactional === false) {
    const isDkimSigned = personalizations.every((personalization) => {
      const personalizationDkim = personalization.dkim_selector;
      const rootDkim = options.dkim?.selector;
      return Boolean(personalizationDkim || rootDkim);
    });

    if (!isDkimSigned) {
      return "Non-transactional messages must be DKIM signed.";
    }

    const hasInvalidRecipientCount = personalizations.some((personalization) => {
      const recipientCount = getRecipientCount(personalization.to) + getRecipientCount(personalization.cc) + getRecipientCount(personalization.bcc);
      return recipientCount !== 1;
    });

    if (hasInvalidRecipientCount) {
      return "Non-transactional messages must have exactly one recipient per personalization.";
    }
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

  private async _sendEmail (options: EmailsSendOptions, flags: { async?: boolean, dryRun?: boolean }): Promise<EmailsSendResponse | EmailsSendAsyncResponse> {
    let error: ErrorResponse | null = null;
    const payload = buildSendPayload(options);
    if (typeof payload === "string") {
      error = createError(payload);
      return flags.async
        ? { data: null, error }
        : { success: false, data: null, error };
    }

    const endpoint = flags.async ? "/tx/v1/send-async" : "/tx/v1/send";
    const response = await this.mailchannels.post<EmailsSendApiResponse | EmailsSendAsyncApiResponse>(endpoint, {
      query: { "dry-run": flags.dryRun },
      body: payload,
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature.",
          [ErrorCode.PayloadTooLarge]: "The total message size should not exceed 30MB. This includes the message itself, headers, and the combined size of any attachments."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, flags.async ? "Failed to queue email." : "Failed to send email.");
      return null;
    });

    if (!response) return { success: false, data: null, error: error! };

    if (flags.async) {
      const asyncResponse = response as EmailsSendAsyncApiResponse;
      const data = clean({
        queuedAt: asyncResponse.queued_at,
        requestId: asyncResponse.request_id
      });

      return { data, error: null };
    }

    const syncResponse = response as EmailsSendApiResponse;
    const data = clean({
      rendered: syncResponse.data,
      requestId: syncResponse.request_id,
      results: syncResponse.results?.map(result => ({
        index: result.index,
        messageId: result.message_id,
        reason: result.reason,
        status: result.status
      }))
    });

    return { success: !!data, data, error: null };
  }

  /**
   * Sends an email message to one or more recipients.
   * @param options - The email options to send.
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, data, error } = await mailchannels.emails.send({
   *   to: 'to@example.com',
   *   from: 'from@example.com',
   *   subject: 'Test',
   *   html: 'Test'
   * })
   * ```
   */
  async send (options: EmailsSendOptions, dryRun = false): Promise<EmailsSendResponse> {
    return this._sendEmail(options, { dryRun }) as Promise<EmailsSendResponse>;
  }

  /**
   * Queues an email message for asynchronous processing and returns immediately with a request ID.
   *
   * The email will be processed in the background, and you'll receive webhook events for all delivery status updates (e.g. `dropped`, `processed`, `delivered`, `hard-bounced`). These webhook events are identical to those sent for the synchronous /send endpoint.
   *
   * Use this endpoint when you need to send emails without waiting for processing to complete. This can improve your application's response time, especially when sending to multiple recipients.
   * @param options - The email options to send.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.emails.sendAsync({
   *   to: 'to@example.com',
   *   from: 'from@example.com',
   *   subject: 'Test',
   *   html: 'Test'
   * })
   * ```
   */
  async sendAsync (options: EmailsSendOptions): Promise<EmailsSendAsyncResponse> {
    return this._sendEmail(options, { async: true }) as Promise<EmailsSendAsyncResponse>;
  }

  /**
   * Validates a domain's email authentication setup by retrieving its DKIM, SPF, and Domain Lockdown status. This endpoint checks whether the domain is properly configured for secure email delivery.
   * @param options - The domain options to check.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.emails.checkDomain({
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
    let error: ErrorResponse | null = null;

    const { dkim, domain, senderId } = options;
    const dkimOptions = dkim ? Array.isArray(dkim) ? dkim: [dkim]: undefined;

    if (dkimOptions && dkimOptions.length > 10) {
      error = createError("A maximum of 10 DKIM settings can be provided.");
      return { data: null, error };
    }

    const invalidDkimSetting = dkimOptions?.find(({ privateKey, selector }) => privateKey && !selector);
    if (invalidDkimSetting) {
      error = createError("DKIM settings with a privateKey must also include a selector.");
      return { data: null, error };
    }

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
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to check domain.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
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
    });

    return { data, error: null };
  }

  /**
   * Create a DKIM key pair for a specified domain and selector using the specified algorithm and key length, for the current customer.
   * @param domain - The domain to create the DKIM key for.
   * @param options - DKIM key creation options.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.emails.createDkimKey('example.com', {
   *   selector: 'mailchannels'
   * })
   * ```
   */
  async createDkimKey (domain: string, options: EmailsCreateDkimKeyOptions): Promise<EmailsCreateDkimKeyResponse> {
    let error: ErrorResponse | null = null;

    if (!options.selector || options.selector.length > 63) {
      error = createError("Selector must be between 1 and 63 characters.");
      return { data: null, error };
    }

    const payload: EmailsCreateDkimKeyPayload = {
      algorithm: options.algorithm,
      key_length: options.length,
      selector: options.selector
    };

    const response = await this.mailchannels.post<EmailsCreateDkimKeyApiResponse>(`/tx/v1/domains/${domain}/dkim-keys`, {
      body: payload,
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Conflict]: "Key pair already created for domain, and selector."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to create DKIM key.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(mapDkimKey(response));

    return { data, error: null };
  }

  /**
   * Search for DKIM keys by domain, with optional filters. If selector is provided, at most one key will be returned.
   * @param domain - The domain to search DKIM keys for.
   * @param options - The options to filter DKIM keys by.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.getDkimKeys('example.com', {
   *   includeDnsRecord: true
   * })
   * ```
   */
  async getDkimKeys (domain: string, options?: EmailsGetDkimKeysOptions): Promise<EmailsGetDkimKeysResponse> {
    let error: ErrorResponse | null = null;

    if (options?.selector && options.selector.length > 63) {
      error = createError("Selector must be between 1 and 63 characters.");
      return { data: null, error };
    }

    error = validatePagination({ ...options, max: 100 });
    if (error) return { data: null, error };

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
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch DKIM keys.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response.keys.map(mapDkimKey));

    return { data, error: null };
  }

  /**
   * Update fields of an existing DKIM key pair for the specified domain and selector, for the current customer. Currently, only the `status` field can be updated.
   * @param domain - The domain the DKIM key belongs to.
   * @param options - The options to update the DKIM key.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.emails.updateDkimKey('example.com', {
   *   selector: 'mailchannels',
   *   status: 'retired'
   * })
   */
  async updateDkimKey (domain: string, options: EmailsUpdateDkimKeyOptions): Promise<SuccessResponse> {
    let error: ErrorResponse | null = null;

    if (!options.selector || options.selector.length > 63) {
      error = createError("Selector must be between 1 and 63 characters.");
      return { success: false, error };
    }

    const payload = {
      status: options.status
    };

    await this.mailchannels.patch(`/tx/v1/domains/${domain}/dkim-keys/${options.selector}`, {
      body: payload,
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "Specified key pair not found, or no active key for rotation. This may also occur if the DKIM domain or selector path parameter is missing."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to update DKIM key.");
    });

    return { success: !error, error };
  }

  /**
   * Rotate an active DKIM key pair. Mark the original key as `rotated`, and create a new key pair with the required new key selector, reusing the same algorithm and key length. The rotated key remains valid for signing for a 3-day grace period, and is automatically changed to `retired` 2 weeks after rotation. Publish the new key to its DNS TXT record before rotated key expires for signing as emails sent with an unpublished key will fail DKIM validation by receiving providers. After the grace period, only the new key is valid for signing if published.
   * @param domain - The domain the DKIM key belongs to.
   * @param selector - The selector of the DKIM key to rotate.
   * @param options - The options to rotate the DKIM key.
   * @param options.newKey.selector - The selector for the new key pair. Must be a maximum of 63 characters.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.emails.rotateDkimKey('example.com', 'mailchannels', {
   *   newKey: {
   *     selector: 'new-selector'
   *   }
   * })
   * ```
   */
  async rotateDkimKey (domain: string, selector: string, options: EmailsRotateDkimKeyOptions): Promise<EmailsRotateDkimKeyResponse> {
    let error: ErrorResponse | null = null;

    if (!selector || selector.length > 63) {
      error = createError("Selector must be between 1 and 63 characters.");
      return { data: null, error };
    }

    if (!options.newKey.selector || options.newKey.selector.length > 63) {
      error = createError("New key selector must be between 1 and 63 characters.");
      return { data: null, error };
    }

    const payload = {
      new_key: {
        selector: options.newKey.selector
      }
    };

    const response = await this.mailchannels.post<EmailsRotateDkimKeyApiResponse>(`/tx/v1/domains/${domain}/dkim-keys/${selector}/rotate`, {
      body: payload,
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "Specified key pair not found.",
          [ErrorCode.Conflict]: "Key pair already created for domain, and provided new key selector."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to rotate DKIM key.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      new: mapDkimKey(response.new_key),
      rotated: mapDkimKey(response.rotated_key)
    });

    return { data, error: null };
  }
}
