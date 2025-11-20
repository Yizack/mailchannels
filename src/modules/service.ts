import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/success-response";
import type { ServiceSubscriptionsResponse } from "../types/service/subscriptions";
import type { ServiceReportOptions } from "../types/service/report";
import { ErrorCode, getStatusError } from "../utils/errors";

export class Service {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Retrieve the condition of the service
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.service.status()
   * ```
   */
  async status (): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    await this.mailchannels.get<void>("/inbound/v1/status", {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response);
      }
    });

    return data;
  }

  /**
   * Get a list of your subscriptions to MailChannels Inbound
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { subscriptions } = await mailchannels.service.subscriptions()
   * ```
   */
  async subscriptions (): Promise<ServiceSubscriptionsResponse> {
    const data: ServiceSubscriptionsResponse = { subscriptions: [], error: null };

    const response = await this.mailchannels.get<ServiceSubscriptionsResponse["subscriptions"]>("/inbound/v1/subscriptions", {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.NotFound]: "We could not find a customer that matched the customerHandle."
        });
      }
    }).catch((error: unknown) => {
      if (!data.error) {
        data.error = error instanceof Error ? error.message : "Failed to fetch subscriptions.";
      }
      return null;
    });

    if (!response) return data;

    data.subscriptions = response;
    return data;
  }

  /**
   * Submit a false negative or false positive report.
   * @param options - The report options
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.service.report({
   * // ...
   * })
   * ```
   */
  async report (options: ServiceReportOptions): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    const { type, ...payload } = options;

    await this.mailchannels.post<void>("/inbound/v1/report", {
      query: {
        report_type: type
      },
      body: payload,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response);
      }
    });

    return data;
  }
}
