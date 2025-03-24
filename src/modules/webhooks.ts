import type { MailChannelsClient } from "../client";
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
  async enroll (endpoint: string): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

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
        data.error = getStatusError(response.status, {
          [ErrorCode.Conflict]: `${endpoint} is already enrolled to receive notifications.`
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
  async list (): Promise<{ webhooks: string[], error: string | null }> {
    const data: { webhooks: string[], error: string | null } = { webhooks: [], error: null };

    const response = await this.mailchannels.get<{ webhook: string }[]>("/tx/v1/webhook", {
      onResponseError: async () => {
        data.error = "Unknown error.";
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
  async delete (): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

    await this.mailchannels.delete<void>("/tx/v1/webhook", {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          data.error = "Unknown error.";
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
  async getSigningKey (id: string): Promise<{ key: string | null, error: string | null }> {
    const data: { key: string | null, error: string | null } = { key: null, error: null };
    const response = await this.mailchannels.get<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      query: {
        id
      },
      onResponseError: ({ response }) => {
        data.error = getStatusError(response.status, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: `The key '${id}' is not found.`
        });
      }
    }).catch(() => null);

    data.key = response?.key || null;
    return data;
  }
}
