import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/success-response";
import type { WebhooksListResponse } from "../types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../types/webhooks/signing-key";
import type { WebhooksValidateResponse } from "../types/webhooks/validate";
import type { WebhooksValidateApiResponse } from "../types/webhooks/internal";
import { ErrorCode, getStatusError } from "../utils/errors";

export class Webhooks {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Enrolls the customer to receive event notifications via webhooks.
   * @param endpoint - The URL to receive event notifications.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = mailchannels.webhooks.enroll('https://example.com/api/webhooks/mailchannels')
   * ```
   */
  async enroll (endpoint: string): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    if (!endpoint) {
      data.error = "No endpoint provided.";
      return data;
    }

    await this.mailchannels.post<void>("/tx/v1/webhook", {
      query: {
        endpoint
      },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.Conflict]: `Endpoint '${endpoint}' is already enrolled to receive notifications.`
        });
      }
    });

    return data;
  }

  /**
   * Retrieves all registered webhook endpoints associated with the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { webhooks } = await mailchannels.webhooks.list()
   * ```
   */
  async list (): Promise<WebhooksListResponse> {
    const data: WebhooksListResponse = { webhooks: [], error: null };

    const response = await this.mailchannels.get<{ webhook: string }[]>("/tx/v1/webhook", {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response);
      }
    }).catch(() => []);

    data.webhooks = response.map(({ webhook }) => webhook);
    return data;
  }

  /**
   * Deletes all registered webhook endpoints for the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.webhooks.delete()
   * ```
   */
  async delete (): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    await this.mailchannels.delete<void>("/tx/v1/webhook", {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          data.error = getStatusError(response);
          return;
        }
        data.success = true;
      }
    });

    return data;
  }

  /**
   * Retrieves the public key used to verify signatures on incoming webhook payloads.
   * @param id - The ID of the key.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { key } = await mailchannels.webhooks.getSigningKey('key-id')
   * ```
   */
  async getSigningKey (id: string): Promise<WebhooksSigningKeyResponse> {
    const data: WebhooksSigningKeyResponse = { key: null, error: null };
    const response = await this.mailchannels.get<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      query: {
        id
      },
      onResponseError: ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: `The key '${id}' is not found.`
        });
      }
    }).catch(() => null);

    data.key = response?.key || null;
    return data;
  }

  /**
   * Validates whether your enrolled webhook(s) respond with an HTTP `2xx` status code. Sends a test request to each webhook containing your customer handle, a hardcoded event type (`test`), a hardcoded sender email (`test@mailchannels.com`), a timestamp, a request ID (provided or generated), and an SMTP ID. The response includes the HTTP status code and body returned by each webhook.
   * @param requestId - Optional identifier in the webhook payload. If not provided, a value will be automatically generated. Must not exceed 28 characters.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { allPassed, results } = await mailchannels.webhooks.validate('optional-request-id')
   * ```
   */
  async validate (requestId?: string): Promise<WebhooksValidateResponse> {
    const data: WebhooksValidateResponse = { allPassed: false, results: [], error: null };

    if (requestId && requestId.length > 28) {
      data.error = "The request id should not exceed 28 characters.";
      return data;
    }

    const response = await this.mailchannels.post<WebhooksValidateApiResponse>("/tx/v1/webhook/validate", {
      body: {
        request_id: requestId
      },
      onResponseError: ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: "No webhooks found for the account."
        });
      }
    }).catch(() => null);

    if (response) {
      data.allPassed = response.all_passed;
      data.results = response.results;
    }

    return data;
  }
}
