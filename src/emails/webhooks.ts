import type { MailChannels } from "../mailchannels";

export const enrollWebhook = (mailchannels: MailChannels) => {
  /**
   * Enrolls the customer to receive event notifications via webhooks.
   * @param endpoint - The URL to receive event notifications
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * await mailchannels.emails.enrollWebhook("https://example.com/webhook");
   * ```
   */
  return async (endpoint: string) => {
    return mailchannels.post<void>("/tx/v1/webhook", {
      query: {
        endpoint
      }
    });
  };
};

export const getWebhooks = (mailchannels: MailChannels) => {
  /**
   * Retrieves all registered webhook endpoints associated with the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const webhooks = await mailchannels.emails.getWebhooks();
   * ```
   */
  return async () => {
    const response = await mailchannels.get<{ webhook: string }[]>("/tx/v1/webhook");
    return {
      webhooks: response.map(({ webhook }) => webhook)
    };
  };
};

export const deleteWebhooks = (mailchannels: MailChannels) => {
  /**
   * Deletes all registered webhook endpoints for the customer.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * await mailchannels.emails.deleteWebhooks();
   * ```
   */
  return async () => {
    return mailchannels.delete<void>("/tx/v1/webhook");
  };
};

export const getSigningKey = (mailchannels: MailChannels) => {
  /**
   * Retrieves the public key used to verify signatures on incoming webhook payloads.
   * @param id - the ID of the key
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { key } = await mailchannels.emails.getSigningKey("key-id");
   * ```
   */
  return async (id: string) => {
    return await mailchannels.get<{ id: string, key: string }>("/tx/v1/webhook/public-key", {
      query: {
        id
      }
    });
  };
};
