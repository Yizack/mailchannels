import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import { clean } from "../utils/helpers";
import type { SuccessResponse } from "../types/responses";
import type { ServiceSubscriptionsResponse } from "../types/service/subscriptions";
import type { ServiceReportOptions } from "../types/service/report";

export class Service {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Retrieve the condition of the service
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.service.status()
   * ```
   */
  async status (): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    await this.mailchannels.get<void>("/inbound/v1/status", {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response);
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to fetch service status.";
    });

    return result;
  }

  /**
   * Get a list of your subscriptions to MailChannels Inbound
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.service.subscriptions()
   * ```
   */
  async subscriptions (): Promise<ServiceSubscriptionsResponse> {
    const result: ServiceSubscriptionsResponse = { data: null, error: null };

    const response = await this.mailchannels.get<ServiceSubscriptionsResponse["data"]>("/inbound/v1/subscriptions", {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: "We could not find a customer that matched the customerHandle."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch subscriptions.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean(response);
    return result;
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
    const result: SuccessResponse = { success: false, error: null };

    const { type, ...payload } = options;

    await this.mailchannels.post<void>("/inbound/v1/report", {
      query: {
        report_type: type
      },
      body: payload,
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response);
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to submit report.";
    });

    return result;
  }
}
