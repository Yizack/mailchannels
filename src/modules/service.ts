import type { MailChannelsClient } from "../client";
import { ErrorCode, createError, getResultError, getStatusError } from "../utils/errors";
import { clean } from "../utils/helpers";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
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
    let error: ErrorResponse | null = null;

    await this.mailchannels.get<void>("/inbound/v1/status", {
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch service status.");
    });

    return { success: !error, error };
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
    let error: ErrorResponse | null = null;

    const response = await this.mailchannels.get<ServiceSubscriptionsResponse["data"]>("/inbound/v1/subscriptions", {
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.NotFound]: "We could not find a customer that matched the customerHandle."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch subscriptions.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response);

    return { data, error: null };
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
    let error: ErrorResponse | null = null;

    const { type, ...payload } = options;

    await this.mailchannels.post<void>("/inbound/v1/report", {
      query: {
        report_type: type
      },
      body: payload,
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to submit report.");
    });

    return { success: !error, error };
  }
}
