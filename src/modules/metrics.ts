import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import type { MetricsEngagementApiResponse, MetricsPerformanceApiResponse } from "../types/metrics/internal";
import type { MetricsOptions } from "../types/metrics";
import type { MetricsEngagementResponse } from "../types/metrics/engagement";
import type { MetricsPerformanceResponse } from "../types/metrics/performance";

const mapBuckets = (arr: { count: number, period_start: string }[]) => {
  return arr.map(({ count, period_start }) => ({ count, periodStart: period_start }));
};

export class Metrics {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Retrieve engagement metrics for messages sent from your account, including counts of open and click events. Supports optional filters for time range, and campaign ID.
   * @param options - Options to filter and customize the engagement metrics retrieval.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { engagement } = await mailchannels.metrics.engagement()
   * ```
   */
  async engagement (options?: MetricsOptions): Promise<MetricsEngagementResponse> {
    const data: MetricsEngagementResponse = { engagement: null, error: null };

    const response = await this.mailchannels.get<MetricsEngagementApiResponse>("/tx/v1/metrics/engagement", {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        campaign_id: options?.campaignId,
        interval: options?.interval
      },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.engagement = {
      buckets: {
        click: mapBuckets(response.buckets.click),
        clickTrackingDelivered: mapBuckets(response.buckets.click_tracking_delivered),
        open: mapBuckets(response.buckets.open),
        openTrackingDelivered: mapBuckets(response.buckets.open_tracking_delivered)
      },
      click: response.click,
      clickTrackingDelivered: response.click_tracking_delivered,
      endTime: response.end_time,
      open: response.open,
      openTrackingDelivered: response.open_tracking_delivered,
      startTime: response.start_time
    };

    return data;
  }

  /**
   * Retrieve performance metrics for messages sent from your account, including counts of processed, delivered, hard-bounced events. Supports optional filters for time range, and campaign ID.
   * @param options - Options to filter and customize the performance metrics retrieval.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { performance } = await mailchannels.metrics.performance()
   * ```
   */
  async performance (options?: MetricsOptions): Promise<MetricsPerformanceResponse> {
    const data: MetricsPerformanceResponse = { performance: null, error: null };

    const response = await this.mailchannels.get<MetricsPerformanceApiResponse>("/tx/v1/metrics/performance", {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        campaign_id: options?.campaignId,
        interval: options?.interval
      },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.performance = {
      bounced: response.bounced,
      buckets: {
        bounced: mapBuckets(response.buckets.bounced),
        delivered: mapBuckets(response.buckets.delivered),
        processed: mapBuckets(response.buckets.processed)
      },
      delivered: response.delivered,
      endTime: response.end_time,
      processed: response.processed,
      startTime: response.start_time
    };

    return data;
  }
}
