export interface SendRecipient {
  /**
   * The email address of the recipient
   */
  email: string;
  /**
   * The name of the recipient
   */
  name?: string;
}

export interface SendContent {
  template_type?: "mustache";
  type: "text/html" | "text/plain";
  value: string;
}

interface SendAttachment {
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

interface SendPersonalization {
  bcc?: SendRecipient[];
  cc?: SendRecipient[];
  dkim_domain?: string;
  dkim_private_key?: string;
  dkim_selector?: string;
  dynamic_template_data?: Record<string, unknown>;
  from?: SendRecipient;
  headers?: Record<string, string>;
  reply_to?: SendRecipient;
  subject?: string;
  to: SendRecipient[];
}

interface SendTracking {
  /**
   * Track when a recipient clicks a link in your email.
   */
  click?: boolean;
  /**
   * Track when a recipient opens your email. Please note that some email clients may not support open tracking.
   */
  open?: boolean;
}

export interface SendPayload {
  attachments?: SendAttachment[];
  content: SendContent[];
  from: SendRecipient;
  headers?: Record<string, string>;
  mailfrom?: SendRecipient;
  personalizations: SendPersonalization[];
  reply_to?: SendRecipient;
  subject: string;
  tracking_settings?: {
    click_tracking?: {
      enable: SendTracking["click"];
    };
    open_tracking?: {
      enable: SendTracking["open"];
    };
  };
}

interface SendOptionsBase {
  /**
   * An array of attachments to be sent with the email
   */
  attachments?: SendAttachment[];
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
  bcc?: SendRecipient[] | SendRecipient | string[] | string;
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
  cc?: SendRecipient[] | SendRecipient | string[] | string;
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
  from?: SendRecipient | string;
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
  to?: SendRecipient[] | SendRecipient | string[] | string;
  /**
   * Adjust open and click tracking for the message. Please note that enabling tracking for your messages requires a subscription that supports open and click tracking.
   */
  tracking?: SendTracking;
  /**
   * A single `replyTo` recipient object, or a single email address.
   * @example
   * { email: 'email@example.com', name: 'Example' }
   * @example
   * 'email@example.com'
   */
  replyTo?: SendRecipient | string;
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

export type SendOptions = SendOptionsBase & (
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

export interface SendResponse {
  success: boolean;
  payload: SendPayload;
  data: string[] | undefined;
}
