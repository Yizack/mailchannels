import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import { parseArrayRecipients, parseRecipient } from "../utils/recipients";
import { clean, stripPemHeaders, validateLimit, validateOffset } from "../utils/helpers";
import type { SuccessResponse } from "../types/responses";
import type { EmailsCheckDomainApiResponse, EmailsCheckDomainPayload, EmailsCreateDkimKeyApiResponse, EmailsCreateDkimKeyPayload, EmailsGetDkimKeysPayload, EmailsRotateDkimKeyApiResponse, EmailsSendApiResponse, EmailsSendContent, EmailsSendPayload } from "../types/emails/internal";
import type { EmailsSendOptions, EmailsSendResponse } from "../types/emails/send";
import type { EmailsCheckDomainOptions, EmailsCheckDomainResponse } from "../types/emails/check-domain";
import type { EmailsCreateDkimKeyOptions, EmailsCreateDkimKeyResponse } from "../types/emails/create-dkim-key";
import type { EmailsGetDkimKeysOptions, EmailsGetDkimKeysResponse } from "../types/emails/get-dkim-keys";
import type { EmailsUpdateDkimKeyOptions } from "../types/emails/update-dkim-key";
import type { EmailsRotateDkimKeyOptions, EmailsRotateDkimKeyResponse } from "../types/emails/rotate-dkim-key";

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
    const { cc, bcc, from, to, html, text, mustaches, dkim } = options;

    const result: EmailsSendResponse = { success: false, data: null, error: null };

    const parsedFrom = parseRecipient(from);
    if (!parsedFrom || !parsedFrom.email) {
      result.error = "No sender provided. Use the `from` option to specify a sender";
      return result;
    }

    const parsedTo = parseArrayRecipients(to);
    if (!parsedTo || !parsedTo.length) {
      result.error = "No recipients provided. Use the `to` option to specify at least one recipient";
      return result;
    }

    if (!text && !html) {
      result.error = "No email content provided";
      return result;
    }

    const content: EmailsSendContent[] = [];
    const template_type = mustaches ? "mustache" : undefined;

    // Plain text must come first if provided
    if (text) content.push({ type: "text/plain", value: text, template_type });
    if (html) content.push({ type: "text/html", value: html, template_type });

    const payload: EmailsSendPayload = {
      attachments: options.attachments,
      campaign_id: options.campaignId,
      personalizations: [{
        bcc: parseArrayRecipients(bcc),
        cc: parseArrayRecipients(cc),
        to: parsedTo,
        dkim_domain: dkim?.domain || undefined,
        dkim_private_key: dkim?.privateKey ? stripPemHeaders(dkim.privateKey) : undefined,
        dkim_selector: dkim?.selector || undefined,
        dynamic_template_data: options.mustaches
      }],
      headers: options.headers,
      reply_to: parseRecipient(options.replyTo),
      from: parsedFrom,
      subject: options.subject,
      content,
      tracking_settings: options.tracking ? {
        click_tracking: options.tracking.click ? { enable: options.tracking.click } : undefined,
        open_tracking: options.tracking.open ? { enable: options.tracking.open } : undefined
      } : undefined,
      transactional: options.transactional
    };

    const response = await this.mailchannels.post<EmailsSendApiResponse>("/tx/v1/send", {
      query: { "dry-run": dryRun },
      body: payload,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature.",
          [ErrorCode.PayloadTooLarge]: "The total message size should not exceed 30MB. This includes the message itself, headers, and the combined size of any attachments."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to send email.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      rendered: response.data,
      requestId: response.request_id,
      results: response.results?.map(result => ({
        index: result.index,
        messageId: result.message_id,
        reason: result.reason,
        status: result.status
      }))
    });

    return result;
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

    const result: EmailsCheckDomainResponse = { data: null, error: null };

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
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Forbidden]: "User does not have access to this feature."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to check domain.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
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
    return result;
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
    const result: EmailsCreateDkimKeyResponse = { data: null, error: null };

    if (!options.selector || options.selector.length > 63) {
      result.error = "Selector must be between 1 and 63 characters.";
    }

    if (result.error) return result;

    const payload: EmailsCreateDkimKeyPayload = {
      algorithm: options.algorithm,
      key_length: options.length,
      selector: options.selector
    };

    const response = await this.mailchannels.post<EmailsCreateDkimKeyApiResponse>(`/tx/v1/domains/${domain}/dkim-keys`, {
      body: payload,
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Conflict]: "Key pair already created for domain, and selector."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to create DKIM key.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      algorithm: response.algorithm,
      createdAt: response.created_at,
      dnsRecords: response.dkim_dns_records,
      domain: response.domain,
      gracePeriodExpiresAt: response.gracePeriodExpiresAt,
      length: response.key_length,
      publicKey: response.public_key,
      retiresAt: response.retiresAt,
      selector: response.selector,
      status: response.status,
      statusModifiedAt: response.status_modified_at
    });

    return result;
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
    const result: EmailsGetDkimKeysResponse = { data: null, error: null };

    if (options?.selector && options.selector.length > 63) {
      result.error = "Selector must be between 1 and 63 characters.";
      return result;
    }

    result.error =
      validateLimit(options?.limit, 100) ||
      validateOffset(options?.offset);

    if (result.error) return result;

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
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch DKIM keys.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean(response.keys.map(key => ({
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
    })));

    return result;
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
    const result: SuccessResponse = { success: false, error: null };

    if (!options.selector || options.selector.length > 63) {
      result.error = "Selector must be between 1 and 63 characters.";
      return result;
    }

    const payload = {
      status: options.status
    };

    await this.mailchannels.patch(`/tx/v1/domains/${domain}/dkim-keys/${options.selector}`, {
      body: payload,
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "Specified key pair not found, or no active key for rotation. This may also occur if the DKIM domain or selector path parameter is missing."
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to update DKIM key.";
    });

    return result;
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
    const result: EmailsRotateDkimKeyResponse = { data: null, error: null };

    if (!selector || selector.length > 63) {
      result.error = "Selector must be between 1 and 63 characters.";
      return result;
    }

    if (!options.newKey.selector || options.newKey.selector.length > 63) {
      result.error = "New key selector must be between 1 and 63 characters.";
      return result;
    }

    const payload = {
      new_key: {
        selector: options.newKey.selector
      }
    };

    const response = await this.mailchannels.post<EmailsRotateDkimKeyApiResponse>(`/tx/v1/domains/${domain}/dkim-keys/${selector}/rotate`, {
      body: payload,
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "Specified key pair not found.",
          [ErrorCode.Conflict]: "Key pair already created for domain, and provided new key selector."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to rotate DKIM key.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      new: {
        algorithm: response.new_key.algorithm,
        createdAt: response.new_key.created_at,
        dnsRecords: response.new_key.dkim_dns_records,
        domain: response.new_key.domain,
        gracePeriodExpiresAt: response.new_key.gracePeriodExpiresAt,
        length: response.new_key.key_length,
        publicKey: response.new_key.public_key,
        retiresAt: response.new_key.retiresAt,
        selector: response.new_key.selector,
        status: response.new_key.status,
        statusModifiedAt: response.new_key.status_modified_at
      },
      rotated: {
        algorithm: response.rotated_key.algorithm,
        createdAt: response.rotated_key.created_at,
        dnsRecords: response.rotated_key.dkim_dns_records,
        domain: response.rotated_key.domain,
        gracePeriodExpiresAt: response.rotated_key.gracePeriodExpiresAt,
        length: response.rotated_key.key_length,
        publicKey: response.rotated_key.public_key,
        retiresAt: response.rotated_key.retiresAt,
        selector: response.rotated_key.selector,
        status: response.rotated_key.status,
        statusModifiedAt: response.rotated_key.status_modified_at
      }
    });

    return result;
  }
}
