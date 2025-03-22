import type { MailChannelsClient } from "../client";
import { ErrorCode } from "../utils/errors";
import { Logger } from "../utils/logger";

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
  async enroll (endpoint: string): Promise<{ success: boolean }> {
    const enrollResponse = { success: false };

    if (!endpoint) {
      Logger.error("No endpoint provided.");
      return enrollResponse;
    }

    await this.mailchannels.post<void>("/tx/v1/webhook", {
      query: {
        endpoint
      },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          enrollResponse.success = true;
          return;
        }
        switch (response.status) {
          case ErrorCode.Conflict:
            return Logger.error(`${endpoint} is already enrolled to receive notifications.`);
          default:
            return Logger.error("Unknown error.");
        }
      }
    });
    return enrollResponse;
  }

  /**
   * Retrieves all registered webhook endpoints associated with the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { webhooks } = await mailchannels.webhooks.list()
   * ```
   */
  async list (): Promise<{ webhooks: string[] }> {
    const response = await this.mailchannels.get<{ webhook: string }[]>("/tx/v1/webhook", {
      onResponseError: async () => {
        Logger.error("Unknown error.");
      }
    }).catch(() => []);

    return {
      webhooks: response.map(({ webhook }) => webhook)
    };
  }

  /**
   * Deletes all registered webhook endpoints for the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.webhooks.delete()
   * ```
   */
  async delete (): Promise<{ success: boolean }> {
    let success = false;

    await this.mailchannels.delete<void>("/tx/v1/webhook", {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          return Logger.error("Unknown error.");
        }
        success = true;
      }
    });

    return { success };
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
  async getSigningKey (id: string): Promise<{ key?: string }> {
    const response = await this.mailchannels.get<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      query: {
        id
      },
      onResponseError: ({ response }) => {
        switch (response.status) {
          case ErrorCode.NotFound:
            return Logger.error(`The key '${id}' is not found.`);
          default:
            return Logger.error("Unknown error.");
        }
      }
    }).catch(() => undefined);

    return {
      key: response?.key
    };
  }
}
