import type { EmailsSendOptions } from "./send";

export type EmailsSendAsyncOptions = EmailsSendOptions;

export interface EmailsSendAsyncResponse {
  /**
   * Indicates if the email request was successfully queued.
   */
  success: boolean;
  data: {
    /**
     * ISO 8601 timestamp when the request was queued for processing.
     */
    queuedAt: string;
    /**
     * Unique identifier for tracking this async request.
     */
    requestId: string;
  } | null;
  error: string | null;
}
