import type { MailChannelsClient } from "../client";
import { ErrorCode, createError, getResultError, getStatusError } from "../utils/errors";
import { clean } from "../utils/helpers";
import { verifySignature } from "../utils/webhooks-validator";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
import type { WebhooksListResponse } from "../types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../types/webhooks/signing-key";
import type { WebhooksValidateResponse } from "../types/webhooks/validate";
import type { WebhooksVerifyOptions } from "../types/webhooks/verify";
import type { WebhooksValidateApiResponse } from "../types/webhooks/internal";

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

    const data = clean({ key: response.key });

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
  static async verify (options: WebhooksVerifyOptions) {
    return verifySignature(options).catch(() => false);
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
  async verify (options: WebhooksVerifyOptions) {
    return Webhooks.verify(options);
  }
}
