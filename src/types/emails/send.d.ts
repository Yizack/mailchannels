export interface EmailsSendRecipient {
  /**
   * The email address of the recipient
   */
  email: string;
  /**
   * The name of the recipient
   */
  name?: string;
}

interface EmailsSendAttachment {
  /**
   * The attachment data, encoded in base64
   */
  content: string;
  /**
   * The name of the attachment file
   */
  filename: string;
  /**
   * The MIME type of the attachment
   */
  type: string;
}

interface EmailsSendTracking {
  /**
   * Track when a recipient clicks a link in your email.
   */
  click?: boolean;
  /**
   * Track when a recipient opens your email. Please note that some email clients may not support open tracking.
   */
  open?: boolean;
}

interface EmailsSendOptionsBase {
  /**
   * An array of attachments to be sent with the email
   */
  attachments?: EmailsSendAttachment[];
  /**
   * The BCC recipients of the email. Can be an array of email addresses or an array of objects with email and name properties or a single email address string or an object with email and name properties.
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
   */
  bcc?: EmailsSendRecipient[] | EmailsSendRecipient | string[] | string;
  /**
   * The CC recipients of the email. Can be an array of email addresses or an array of objects with email and name properties or a single email address string or an object with email and name properties.
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
   */
  cc?: EmailsSendRecipient[] | EmailsSendRecipient | string[] | string;
  dkim?: {
    domain: string;
    privateKey: string;
    selector: string;
  };
  /**
   * The sender of the email. Can be a string or an object with email and name properties.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   */
  from?: EmailsSendRecipient | string;
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
   */
  to?: EmailsSendRecipient[] | EmailsSendRecipient | string[] | string;
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
   */
  replyTo?: EmailsSendRecipient | string;
  /**
   * The subject of the email
   */
  subject: string;
  /**
   * Data to be used if the email is a mustache template, key-value pairs of variables to set for template rendering. Keys must be strings
   *
   * the values can be one of the following types:
   * - string
   * - number
   * - boolean
   * - list, whose values are all of permitted types
   * - map, whose keys must be strings, and whose values are all of permitted types
   */
  mustaches?: Record<string, unknown>;
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
  success: boolean;
  data: string[] | undefined;
}
