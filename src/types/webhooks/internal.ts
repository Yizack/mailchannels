export interface WebhooksValidateApiResponse {
  all_passed: boolean;
  results: {
    result: "passed" | "failed";
    webhook: string;
    response: {
      body?: string;
      status: number;
    } | null;
  }[];
}

export interface WebhooksBatchesApiResponse {
  webhook_batches: {
    batch_id: number;
    created_at: string;
    customer_handle: string;
    duration?: {
      unit: "milliseconds";
      value: number;
    };
    event_count: number;
    status: "no_response" | "1xx_response" | "2xx_response" | "3xx_response" | "4xx_response" | "5xx_response";
    status_code: number | null;
    webhook: string;
  }[];
}

export interface WebhooksResendBatchApiResponse {
  batch_id: number;
  customer_handle: string;
  webhook: string;
  created_at: string;
  event_count: number;
  duration_in_ms: number | null;
  status_code: number | null;
}
