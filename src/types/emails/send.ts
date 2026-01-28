import type { DataResponse, SuccessResponse } from "../responses";

export interface EmailsSendRecipient {
  /**
   * The email address of the recipient.
   */
  email: string;
  /**
   * The name of the recipient. Display name in raw text, e.g. John Doe, 张三.
   */
  name?: string;
}

export interface EmailsSendAttachment {
  /**
   * The attachment data, encoded in base64.
   */
  content: string;
  /**
   * The name of the attachment file.
   */
  filename: string;
  /**
   * The MIME type of the attachment.
   */
  type: string;
}

export interface EmailsSendTracking {
  /**
   * Track when a recipient clicks a link in your email.
   * @default false
   */
  click?: boolean;
  /**
   * Track when a recipient opens your email. Please note that some email clients may not support open tracking.
   * @default false
   */
  open?: boolean;
}

interface EmailsSendOptionsBase {
  /**
   * An array of attachments to be sent with the email.
   */
  attachments?: EmailsSendAttachment[];
  /**
   * The campaign identifier. If specified, this ID will be included in all relevant webhooks. It can be up to 48 UTF-8 characters long and must not contain spaces.
   */
  campaignId?: string;
  /**
   * The BCC recipients of the email. Can be an array of email addresses or an array of objects with email and name properties or a single email address string or an object with email and name properties.
   * @example
   * [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' }
   * ]
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * ['email1@example.com', 'email2@example.com']
   * @example
   * 'email@example.com'
   * @example
   * 'Name <email@example.com>'
   */
  bcc?: EmailsSendRecipient[] | EmailsSendRecipient | string[] | string;
  /**
   * The CC recipients of the email. Can be an array of email addresses or an array of objects with email and name properties or a single email address string or an object with email and name properties.
   * @example
   * [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' }
   * ]
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * ['email1@example.com', 'email2@example.com']
   * @example
   * 'email@example.com'
   * @example
   * 'Name <email@example.com>'
   */
  cc?: EmailsSendRecipient[] | EmailsSendRecipient | string[] | string;
  /**
   * The DKIM settings for the email.
   */
  dkim?: {
    /**
     * Domain used for DKIM signing.
     */
    domain: string;
    /**
     * DKIM private key encoded in Base64.
     */
    privateKey?: string;
    /**
     * DKIM selector in the domain DNS records.
     */
    selector: string;
  };
  /**
   * Optional envelope sender address. If not set, the envelope sender defaults to the `from.email` field. Can be overridden per-personalization. Only the email portion is used; the name field is ignored.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   * @example
   * 'Name <email@example.com>'
   */
  envelopeFrom?: EmailsSendRecipient | string;
  /**
   * The sender of the email. Can be a string or an object with email and name properties.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   * @example
   * 'Name <email@example.com>'
   */
  from: EmailsSendRecipient | string;
  /**
   * An object containing key-value pairs, where both keys (header names) and values must be strings. These pairs represent custom headers to be substituted.
   *
   * Please note the following restrictions and behavior:
   * - **Reserved headers**: The following headers cannot be modified: `Authentication-Results`, `BCC`, `CC`, `Content-Transfer-Encoding`, `Content-Type`, `DKIM-Signature`, `From`, `Message-ID`, `Received`, `Reply-To`, `Subject`, `To`.
   * - **Header precedence**: If a header is defined in both the personalizations object and the root headers, the value from personalizations will be used.
   * - **Case sensitivity**: Headers are treated as case-insensitive. If multiple headers differ only by case, only one will be used, with no guarantee of which one.
   */
  headers?: Record<string, string>;
  /**
   * The recipient of the email. Can be an array of email addresses or an array of objects with `email` and `name` properties or a single email address string or an object with `email` and `name` properties.
   * @example
   * [
   *   { email: 'email1@example.com', name: 'Example1' },
   *   { email: 'email2@example.com', name: 'Example2' },
   * ]
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * ['email1@example.com', 'email2@example.com']
   * @example
   * 'email@example.com'
   * @example
   * 'Name <email@example.com>'
   */
  to: EmailsSendRecipient[] | EmailsSendRecipient | string[] | string;
  /**
   * Adjust open and click tracking for the message. Please note that enabling tracking for your messages requires a subscription that supports open and click tracking.
   *
   * Only links (`<a>` tags) meeting all of the following conditions are processed for click tracking:
   * - The URL is non-empty.
   * - The URL starts with `http` or `https`.
   * - The link does not have a `clicktracking` attribute set to `off`.
   */
  tracking?: EmailsSendTracking;
  /**
   * A single `replyTo` recipient object, or a single email address.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   * @example
   * 'Name <email@example.com>'
   */
  replyTo?: EmailsSendRecipient | string;
  /**
   * The subject of the email.
   */
  subject: string;
  /**
   * Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering. Keys must be strings.
   *
   * the values can be one of the following types:
   * - string
   * - number
   * - boolean
   * - list, whose values are all of permitted types
   * - map, whose keys must be strings, and whose values are all of permitted types
   */
  mustaches?: Record<string, unknown>;
  /**
   * Mark these messages as transactional or non-transactional. In order for a message to be marked as non-transactional, it must have exactly one recipient per personalization, and it must be DKIM signed. 400 Bad Request will be returned if there are more than one recipient in any personalization for non-transactional messages. If a message is marked as non-transactional, it changes the sending process as follows:
   *
   * List-Unsubscribe headers will be added.
   * @default true
   */
  transactional?: boolean;
}

export type EmailsSendOptions = EmailsSendOptionsBase & (
  | {
    /**
     * The HTML content of the email.
     * @example
     * '<p>Hello World</p>'
     */
    html: string;
    /**
     * The plain text content of the email (optional when html is provided).
     * @example
     * 'Hello World'
     */
    text?: string;
  }
  | {
    /**
     * The HTML content of the email (optional when text is provided).
     * @example
     * '<p>Hello World</p>'
     */
    html?: string;
    /**
     * The plain text content of the email.
     * @example
     * 'Hello World'
     */
    text: string;
  }
);

export type EmailsSendResponse = SuccessResponse & DataResponse<{
  /**
   * Fully rendered message if `dryRun` was set to `true`. A string representation of a rendered message, one per personalization in the request.
   */
  rendered?: string[];
  /**
   * The Request ID is a unique identifier generated by the service to track the HTTP request. It will also be included in all webhooks for reference.
   */
  requestId?: string;
  results?: {
    /**
     * The index of the personalization in the request. Starts at 0.
     */
    index?: number;
    /**
     * The Message ID is a unique identifier generated by the service. Each personalization has a distinct Message ID, which is also used in the `Message-Id` header and included in webhooks.
     */
    messageId: string;
    /**
     * A human-readable explanation of the status.
     */
    reason?: string;
    /**
     * The status of the message. Note that 'sent' is a temporary status; the final status will be provided through webhooks, if configured.
     */
    status: "sent" | "failed";
  }[];
}>;
