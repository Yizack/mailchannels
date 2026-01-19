export type EmailsSendAsyncResponse = DataResponse<{
  /**
   * ISO 8601 timestamp when the request was queued for processing.
   */
  queuedAt: string[];
  /**
   * Unique identifier for tracking this async request. Will be included in all webhook events for this request.
   */
  requestId: string;
}>;
