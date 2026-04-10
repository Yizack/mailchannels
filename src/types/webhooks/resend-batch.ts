import type { DataResponse } from "../responses";

export interface WebhooksResendBatch {
  /**
   * Unique identifier for the webhook batch.
   */
  batchId: number;
  /**
   * Customer handle associated with the webhook batch.
   */
  customerHandle: string;
  /**
   * Webhook URL to which events in the batch were posted.
   */
  webhook: string;
  /**
   * Timestamp of when the webhook batch was created.
   */
  createdAt: string;
  /**
   * Number of events in the webhook batch.
   */
  eventCount: number;
  /**
   * Duration of the webhook batch in milliseconds. `null` indicates that no response was returned from the webhook endpoint.
   */
  duration: number | null;
  /**
   * HTTP status code returned by the webhook endpoint. `null` indicates that no response was returned from the webhook endpoint.
   */
  statusCode: number | null;
}

export type WebhooksResendBatchResponse = DataResponse<WebhooksResendBatch>;
