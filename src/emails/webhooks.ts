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
