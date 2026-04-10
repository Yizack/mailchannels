import type { MailChannelsClient } from "../client";
import { ErrorCode, createError, getResultError, getStatusError, validatePagination } from "../utils/errors";
import { clean } from "../utils/helpers";
import { isValidWebhook } from "../utils/webhooks-validator";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
import type { WebhooksListResponse } from "../types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../types/webhooks/signing-key";
import type { WebhooksValidateResponse } from "../types/webhooks/validate";
import type { WebhooksVerifyOptions } from "../types/webhooks/verify";
import type { WebhooksBatchesOptions, WebhooksBatchesResponse } from "../types/webhooks/batches";
import type { WebhooksResendBatchResponse } from "../types/webhooks/resend-batch";
import type { WebhooksBatchesApiResponse, WebhooksResendBatchApiResponse, WebhooksValidateApiResponse } from "../types/webhooks/internal";

export class Webhooks {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Enrolls the customer to receive event notifications via webhooks.
   * @param endpoint - The URL to receive event notifications. Must be no longer than `8000` characters.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = mailchannels.webhooks.enroll('https://example.com/api/webhooks/mailchannels')
   * ```
   */
  async enroll (endpoint: string): Promise<SuccessResponse> {
    let error: ErrorResponse | null = null;

    if (!endpoint) {
      error = createError("No endpoint provided.");
      return { success: false, error };
    }

    if (endpoint.length > 8000) {
      error = createError("The endpoint exceeds the maximum length of 8000 characters.");
      return { success: false, error };
    }

    await this.mailchannels.post<void>("/tx/v1/webhook", {
      query: {
        endpoint
      },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Conflict]: `Endpoint '${endpoint}' is already enrolled to receive notifications.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to enroll webhook.");
    });

    return { success: !error, error };
  }

  /**
   * Retrieves all registered webhook endpoints associated with the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.webhooks.list()
   * ```
   */
  async list (): Promise<WebhooksListResponse> {
    let error: ErrorResponse | null = null;

    const response = await this.mailchannels.get<{ webhook: string }[]>("/tx/v1/webhook", {
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch webhooks.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response.map(({ webhook }) => webhook));

    return { data, error: null };
  }

  /**
   * Deletes all registered webhook endpoints for the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.webhooks.delete()
   * ```
   */
  async delete (): Promise<SuccessResponse> {
    let error: ErrorResponse | null = null;

    await this.mailchannels.delete<void>("/tx/v1/webhook", {
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to delete webhooks.");
    });

    return { success: !error, error };
  }

  /**
   * Retrieves the public key used to verify signatures on incoming webhook payloads.
   * @param id - The ID of the key.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.webhooks.getSigningKey('key-id')
   * ```
   */
  async getSigningKey (id: string): Promise<WebhooksSigningKeyResponse> {
    let error: ErrorResponse | null = null;

    const response = await this.mailchannels.get<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      query: {
        id
      },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: `The key '${id}' is not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to get signing key.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      id: response.id,
      key: response.key
    });

    return { data, error: null };
  }

  /**
   * Validates whether your enrolled webhook(s) respond with an HTTP `2xx` status code. Sends a test request to each webhook containing your customer handle, a hardcoded event type (`test`), a hardcoded sender email (`test@mailchannels.com`), a timestamp, a request ID (provided or generated), and an SMTP ID. The response includes the HTTP status code and body returned by each webhook.
   * @param requestId - Optional identifier in the webhook payload. If not provided, a value will be automatically generated. Must not exceed 28 characters.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.webhooks.validate('optional-request-id')
   * ```
   */
  async validate (requestId?: string): Promise<WebhooksValidateResponse> {
    let error: ErrorResponse | null = null;

    if (requestId && requestId.length > 28) {
      error = createError("The request id should not exceed 28 characters.");
      return { data: null, error };
    }

    const response = await this.mailchannels.post<WebhooksValidateApiResponse>("/tx/v1/webhook/validate", {
      body: {
        request_id: requestId
      },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "No webhooks found for the account."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to validate webhooks.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      allPassed: response.all_passed,
      results: response.results
    });

    return { data, error: null };
  }

  /**
   * Verifies the authenticity of incoming webhook requests by validating their signatures using the provided options.
   * @param options - The options for verifying the webhook.
   * @example
   * ```ts
   * const isValid = await Webhooks.verify({ payload: rawBody, headers })
   * ```
   */
  static async verify (options: WebhooksVerifyOptions): Promise<boolean> {
    return isValidWebhook(options).catch(() => false);
  }

  /**
   * Verifies the authenticity of incoming webhook requests by validating their signatures using the provided options.
   * @param options - The options for verifying the webhook.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const isValid = await mailchannels.webhooks.verify({ payload: rawBody, headers })
   * ```
   */
  async verify (options: WebhooksVerifyOptions): Promise<boolean> {
    return Webhooks.verify(options);
  }

  /**
   * Retrieves paged webhook batches associated with the customer. The time range specified by `createdAfter` and `createdBefore` must not exceed 31 days. If neither is specified, the default time range is the last 3 days.
   * @param options - The options for listing webhook batches.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.webhooks.batches()
   * ```
   */
  async batches (options?: WebhooksBatchesOptions): Promise<WebhooksBatchesResponse> {
    let error: ErrorResponse | null = null;

    error = validatePagination({ ...options, max: 500 });
    if (error) return { data: null, error };

    if (options?.statuses && options.statuses.length > 6) {
      return { data: null, error: createError("A maximum of 6 status filters can be provided.") };
    }

    if (options?.statuses && new Set(options.statuses).size !== options.statuses.length) {
      return { data: null, error: createError("Status filters must be unique.") };
    }

    if (options?.createdAfter && Number.isNaN(Date.parse(options.createdAfter))) {
      return { data: null, error: createError("createdAfter must be a valid date string.") };
    }

    if (options?.createdBefore && Number.isNaN(Date.parse(options.createdBefore))) {
      return { data: null, error: createError("createdBefore must be a valid date string.") };
    }

    if (options?.createdAfter && options?.createdBefore) {
      const createdAfter = Date.parse(options.createdAfter);
      const createdBefore = Date.parse(options.createdBefore);
      const maxRangeMs = 31 * 24 * 60 * 60 * 1000;

      if (createdBefore <= createdAfter) {
        return { data: null, error: createError("createdBefore must be later than createdAfter.") };
      }

      if ((createdBefore - createdAfter) > maxRangeMs) {
        return { data: null, error: createError("The time range between createdAfter and createdBefore must not exceed 31 days.") };
      }
    }

    const response = await this.mailchannels.get<WebhooksBatchesApiResponse>("/tx/v1/webhook-batch", {
      query: {
        created_after: options?.createdAfter,
        created_before: options?.createdBefore,
        statuses: options?.statuses,
        webhook: options?.webhook,
        limit: options?.limit,
        offset: options?.offset
      },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch webhook batches.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response.webhook_batches.map(batch => ({
      batchId: batch.batch_id,
      createdAt: batch.created_at,
      customerHandle: batch.customer_handle,
      duration: batch.duration,
      eventCount: batch.event_count,
      status: batch.status,
      statusCode: batch.status_code,
      webhook: batch.webhook
    })));

    return { data, error: null };
  }

  /**
   * Synchronously resends the webhook batch with the provided `batchId` for the customer. The result is returned in the response.
   * @param batchId - The ID of the batch to resend.
   * @param customerHandle - The handle of the customer who owns the batch.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.webhooks.resendBatch(123)
   * ```
   */
  async resendBatch (batchId: number): Promise<WebhooksResendBatchResponse> {
    let error: ErrorResponse | null = null;

    const response = await this.mailchannels.post<WebhooksResendBatchApiResponse>(`/tx/v1/webhook-batch/${batchId}/resend`, {
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request. The batch ID is invalid.",
          [ErrorCode.NotFound]: `The batch '${batchId}' is not found for the customer.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to resend webhook batch.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      batchId: response.batch_id,
      customerHandle: response.customer_handle,
      webhook: response.webhook,
      createdAt: response.created_at,
      eventCount: response.event_count,
      duration: response.duration_in_ms,
      statusCode: response.status_code
    });

    return { data, error: null };
  }
}
