import type { MailChannelsClient } from "../../client";
import type { WebhooksListApiResponse, WebhooksListResponse, WebhooksSigningKeyResponse } from "../../types/emails/webhooks";

export class Webhooks {
  constructor (protected mailchannels: MailChannelsClient) {}
  /**
   * Enrolls the customer to receive event notifications via webhooks.
   * @param endpoint - The URL to receive event notifications
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * await mailchannels.emails.enrollWebhook("https://example.com/webhook");
   * ```
   */
  async enrollWebhook (endpoint: string): Promise<void> {
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
   * const { webhooks } = await mailchannels.emails.listWebhooks();
   * ```
   */
  async listWebhooks (): Promise<WebhooksListResponse> {
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
   * await mailchannels.emails.deleteWebhooks();
   * ```
   */
  async deleteWebhooks (): Promise<void> {
    return this.mailchannels.delete<void>("/tx/v1/webhook");
  }

  /**
   * Retrieves the public key used to verify signatures on incoming webhook payloads.
   * @param id - the ID of the key
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { key } = await mailchannels.emails.getSigningKey("key-id");
   * ```
   */
  async getSigningKey (id: string): Promise<WebhooksSigningKeyResponse> {
    return await this.mailchannels.get<WebhooksSigningKeyResponse>("/tx/v1/webhook/public-key", {
      query: {
        id
      }
    });
  }
}
