export interface EmailsSendRecipient {
  /**
   * The email address of the recipient.
   */
  email: string;
  /**
   * The name of the recipient.
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
    privateKey: string;
    /**
     * DKIM selector in the domain DNS records.
     */
    selector: string;
  };
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
     * The HTML content of the email
     * @example
     * '<p>Hello World</p>'
     */
    html: string;
    /**
     * The plain text content of the email (optional when html is provided)
     * @example
     * 'Hello World'
     */
    text?: string;
  }
  | {
    /**
     * The HTML content of the email (optional when text is provided)
     * @example
     * '<p>Hello World</p>'
     */
    html?: string;
    /**
     * The plain text content of the email
     * @example
     * 'Hello World'
     */
    text: string;
  }
);

export interface EmailsSendResponse {
  /**
   * Indicates if the email was successfully sent
   */
  success: boolean;
  /**
   * Fully rendered message if `dryRun` was set to `true`
   */
  data?: string[];
  error: string | null;
}
