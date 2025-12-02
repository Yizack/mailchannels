import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/responses";
import type { WebhooksListResponse } from "../types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../types/webhooks/signing-key";
import type { WebhooksValidateResponse } from "../types/webhooks/validate";
import type { WebhooksValidateApiResponse } from "../types/webhooks/internal";
import { ErrorCode, getStatusError } from "../utils/errors";

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
    const result: SuccessResponse = { success: false, error: null };

    if (!endpoint) {
      result.error = "No endpoint provided.";
      return result;
    }

    if (endpoint.length > 8000) {
      result.error = "The endpoint exceeds the maximum length of 8000 characters.";
      return result;
    }

    await this.mailchannels.post<void>("/tx/v1/webhook", {
      query: {
        endpoint
      },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.Conflict]: `Endpoint '${endpoint}' is already enrolled to receive notifications.`
        });
      }
    });

    return result;
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
    const result: WebhooksListResponse = { data: null, error: null };

    const response = await this.mailchannels.get<{ webhook: string }[]>("/tx/v1/webhook", {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response);
      }
    }).catch((error: unknown) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch webhooks.";
      }
      return null;
    });

    if (!response) return result;

    result.data = response.map(({ webhook }) => webhook);
    return result;
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
    const result: SuccessResponse = { success: false, error: null };

    await this.mailchannels.delete<void>("/tx/v1/webhook", {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          result.error = getStatusError(response);
          return;
        }
        result.success = true;
      }
    });

    return result;
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
    const result: WebhooksSigningKeyResponse = { data: null, error: null };
    const response = await this.mailchannels.get<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      query: {
        id
      },
      onResponseError: ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: `The key '${id}' is not found.`
        });
      }
    }).catch(() => null);

    if (response) {
      result.data = { key: response.key };
    }
    return result;
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
    const result: WebhooksValidateResponse = { data: null, error: null };

    if (requestId && requestId.length > 28) {
      result.error = "The request id should not exceed 28 characters.";
      return result;
    }

    const response = await this.mailchannels.post<WebhooksValidateApiResponse>("/tx/v1/webhook/validate", {
      body: {
        request_id: requestId
      },
      onResponseError: ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "No webhooks found for the account."
        });
      }
    }).catch(() => null);

    if (!response) return result;

    result.data = {
      allPassed: response.all_passed,
      results: response.results
    };

    return result;
  }
}
