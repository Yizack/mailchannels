import type { DataResponse } from "../responses";

export type WebhooksBatchStatus = "1xx" | "2xx" | "3xx" | "4xx" | "5xx" | "no_response";
export type WebhooksBatchResponseStatus = "1xx_response" | "2xx_response" | "3xx_response" | "4xx_response" | "5xx_response" | "no_response";

export interface WebhooksBatchesOptions {
  /**
   * Inclusive lower bound (UTC) for filtering webhook batches by creation time. Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`.
   */
  createdAfter?: string;
  /**
   * Exclusive upper bound (UTC) for filtering webhook batches by creation time. Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`.
   */
  createdBefore?: string;
  /**
   * Filters webhook batches by webhook response status category. If not provided, batches with all categories are returned.
   */
  statuses?: WebhooksBatchStatus[];
  /**
   * Filters webhook batches by the webhook endpoint to which events in the batch were posted.
   */
  webhook?: string;
  /**
   * The maximum number of webhook batches to return. Must be between `1` and `500`.
   * @default 500
   */
  limit?: number;
  /**
   * The number of webhook batches to skip before starting to collect the result set.
   * @default 0
   */
  offset?: number;
}

export interface WebhooksBatch {
  /**
   * Unique identifier for the webhook batch.
   */
  batchId: number;
  /**
   * Timestamp of when the webhook batch was created.
   */
  createdAt: string;
  /**
   * Customer handle associated with the webhook batch.
   */
  customerHandle: string;
  /**
   * Duration of the webhook batch, measured from the time the request was sent to the webhook endpoint until the response was received.
   */
  duration?: {
    unit: "milliseconds";
    value: number;
  };
  /**
   * Number of events in the webhook batch.
   */
  eventCount: number;
  /**
   * Status of the webhook batch.
   */
  status: WebhooksBatchResponseStatus;
  /**
   * HTTP status code returned by the webhook endpoint.
   */
  statusCode: number | null;
  /**
   * Webhook endpoint to which events in the batch were posted.
   */
  webhook: string;
}

export type WebhooksBatchesResponse = DataResponse<WebhooksBatch[]>;
