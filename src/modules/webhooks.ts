import type { MailChannelsClient } from "../client";
import type { WebhooksListResponse } from "../types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../types/webhooks/signing-key";
import type { WebhooksListApiResponse } from "../types/webhooks/internal";

export class Webhooks {
  constructor (protected mailchannels: MailChannelsClient) {}
  /**
   * Enrolls the customer to receive event notifications via webhooks.
   * @param endpoint - The URL to receive event notifications
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * await mailchannels.webhooks.enroll("https://example.com/api/webhooks/mailchannels");
   * ```
   */
  async enroll (endpoint: string): Promise<void> {
    return this.mailchannels.post<void>("/tx/v1/webhook", {
      query: {
        endpoint
      }
    });
  }

  /**
   * Retrieves all registered webhook endpoints associated with the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { webhooks } = await mailchannels.webhooks.list();
   * ```
   */
  async list (): Promise<WebhooksListResponse> {
    const response = await this.mailchannels.get<WebhooksListApiResponse>("/tx/v1/webhook");

    return {
      webhooks: response.map(({ webhook }) => webhook)
    };
  }

  /**
   * Deletes all registered webhook endpoints for the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * await mailchannels.webhooks.delete();
   * ```
   */
  async delete (): Promise<void> {
    return this.mailchannels.delete<void>("/tx/v1/webhook");
  }

  /**
   * Retrieves the public key used to verify signatures on incoming webhook payloads.
   * @param id - the ID of the key
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { key } = await mailchannels.webhooks.getSigningKey("key-id");
   * ```
   */
  async getSigningKey (id: string): Promise<WebhooksSigningKeyResponse> {
    return this.mailchannels.get<WebhooksSigningKeyResponse>("/tx/v1/webhook/public-key", {
      query: {
        id
      }
    });
  }
}
