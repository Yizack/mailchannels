import type { MailChannelsClient } from "../client";
import type { WebhooksListResponse } from "../types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../types/webhooks/signing-key";
import type { SuccessResponse } from "../types/success-response";
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
}
