export type WebhooksBatchStatusFilter = "1xx" | "2xx" | "3xx" | "4xx" | "5xx" | "no_response";
export type WebhooksBatchStatus = "1xx_response" | "2xx_response" | "3xx_response" | "4xx_response" | "5xx_response" | "no_response";

export interface WebhooksListBatchesOptions {
  /**
   * Inclusive lower bound for filtering webhook batches by creation time.
   */
  createdAfter?: string;
  /**
   * Exclusive upper bound for filtering webhook batches by creation time.
   */
  createdBefore?: string;
  /**
   * Filter webhook batches by status category.
   */
  statuses?: WebhooksBatchStatusFilter[];
  /**
   * Filter webhook batches by endpoint URL.
   */
  webhook?: string;
  /**
   * The maximum number of webhook batches to return.
   */
  limit?: number;
  /**
   * The number of webhook batches to skip.
   */
  offset?: number;
}

export interface WebhooksBatch {
  batchId: number;
  createdAt: string;
  customerHandle: string;
  duration?: {
    unit: "milliseconds";
    value: number;
  };
  eventCount: number;
  status: WebhooksBatchStatus;
  statusCode?: number | null;
  webhook: string;
}

export interface WebhooksListBatchesResponse {
  batches: WebhooksBatch[];
  error: string | null;
}
