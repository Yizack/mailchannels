export type WebhookEventType =
  | "processed"
  | "delivered"
  | "open"
  | "click"
  | "hard-bounced"
  | "soft-bounced"
  | "dropped"
  | "complained"
  | "unsubscribed"
  | "test";

interface WebhookEventBase<T extends WebhookEventType> {
  /**
   * The sender's email address
   */
  email?: string;
  /**
   * The MailChannels account ID that generated the webhook.
   * If the message was sent by a sub-account, this field contains the sub-account handle.
   */
  customer_handle: string;
  /**
   * The Unix timestamp (in seconds) when the event occurred; the timezone is always UTC
   */
  timestamp: number;
  /**
   * The Message-Id of the message that generated the event
   */
  smtp_id?: string;
  /**
   * The type of event that occurred
   */
  event: T;
  /**
   * A unique identifier generated to track the original HTTP request
   */
  request_id?: string;
  /**
   * The campaign identifier for the message that generated the event
   */
  campaign_id?: string;
  /**
   * The recipients of the message
   */
  recipients?: string[];
}

export interface WebhookEventProcessed extends WebhookEventBase<"processed"> {}

export interface WebhookEventDelivered extends WebhookEventBase<"delivered"> {}

interface WebhookEventWithTracking {
  /**
   * The User-Agent header given when the recipient opened the message
   */
  user_agent?: string;
  /**
   * The IP address of the host that made the HTTP request
   */
  ip?: string;
}

export interface WebhookEventOpen extends WebhookEventBase<"open">, WebhookEventWithTracking {}

export interface WebhookEventClick extends WebhookEventBase<"click">, WebhookEventWithTracking {
  /**
   * The URL that was clicked by the recipient
   */
  url?: string;
}

interface WebhookEventWithStatus {
  /**
   * The SMTP status code that caused the bounce
   */
  status?: string;
  /**
   * A human-readable explanation of why the message hard-bounced
   */
  reason?: string;
}

export interface WebhookEventHardBounced extends WebhookEventBase<"hard-bounced">, WebhookEventWithStatus {}

export interface WebhookEventSoftBounced extends WebhookEventBase<"soft-bounced">, WebhookEventWithStatus {}

export interface WebhookEventDropped extends WebhookEventBase<"dropped">, WebhookEventWithStatus {}

export interface WebhookEventComplained extends WebhookEventBase<"complained"> {}

export interface WebhookEventUnsubscribed extends WebhookEventBase<"unsubscribed"> {}

export interface WebhookEventTest extends Omit<WebhookEventBase<"test">, "recipients" | "campaign_id"> {}

export type WebhookEvent =
  | WebhookEventProcessed
  | WebhookEventDelivered
  | WebhookEventOpen
  | WebhookEventClick
  | WebhookEventHardBounced
  | WebhookEventSoftBounced
  | WebhookEventDropped
  | WebhookEventComplained
  | WebhookEventUnsubscribed
  | WebhookEventTest;

export type WebhookEvents = WebhookEvent[];
