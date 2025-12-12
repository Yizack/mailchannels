import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import { clean, mapBuckets, validateLimit, validateOffset } from "../utils/helpers";
import type { MetricsEngagementApiResponse, MetricsPerformanceApiResponse, MetricsRecipientBehaviourApiResponse, MetricsSendersApiResponse, MetricsUsageApiResponse, MetricsVolumeApiResponse } from "../types/metrics/internal";
import type { MetricsOptions } from "../types/metrics";
import type { MetricsEngagementResponse } from "../types/metrics/engagement";
import type { MetricsPerformanceResponse } from "../types/metrics/performance";
import type { MetricsRecipientBehaviourResponse } from "../types/metrics/recipient-behaviour";
import type { MetricsVolumeResponse } from "../types/metrics/volume";
import type { MetricsUsageResponse } from "../types/metrics/usage";
import type { MetricsSendersOptions, MetricsSendersResponse, MetricsSendersType } from "../types/metrics/senders";

export class Metrics {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Retrieve engagement metrics for messages sent from your account, including counts of open and click events. Supports optional filters for time range, and campaign ID.
   * @param options - Options to filter and customize the engagement metrics retrieval.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.metrics.engagement()
   * ```
   */
  async engagement (options?: MetricsOptions): Promise<MetricsEngagementResponse> {
    const result: MetricsEngagementResponse = { data: null, error: null };

    const response = await this.mailchannels.get<MetricsEngagementApiResponse>("/tx/v1/metrics/engagement", {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        campaign_id: options?.campaignId,
        interval: options?.interval
      },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch engagement metrics.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
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
    });

    return result;
  }

  /**
   * Retrieve performance metrics for messages sent from your account, including counts of processed, delivered, hard-bounced events. Supports optional filters for time range, and campaign ID.
   * @param options - Options to filter and customize the performance metrics retrieval.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.metrics.performance()
   * ```
   */
  async performance (options?: MetricsOptions): Promise<MetricsPerformanceResponse> {
    const result: MetricsPerformanceResponse = { data: null, error: null };

    const response = await this.mailchannels.get<MetricsPerformanceApiResponse>("/tx/v1/metrics/performance", {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        campaign_id: options?.campaignId,
        interval: options?.interval
      },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch performance metrics.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
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
    });

    return result;
  }

  /**
   * Retrieve recipient behaviour metrics for messages sent from your account, including counts of unsubscribed events. Supports optional filters for time range, and campaign ID.
   * @param options - Options to filter and customize the recipient behaviour metrics retrieval.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.metrics.recipientBehaviour()
   * ```
   */
  async recipientBehaviour (options?: MetricsOptions): Promise<MetricsRecipientBehaviourResponse> {
    const result: MetricsRecipientBehaviourResponse = { data: null, error: null };

    const response = await this.mailchannels.get<MetricsRecipientBehaviourApiResponse>("/tx/v1/metrics/recipient-behaviour", {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        campaign_id: options?.campaignId,
        interval: options?.interval
      },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch recipient behaviour metrics.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      buckets: {
        unsubscribeDelivered: mapBuckets(response.buckets.unsubscribe_delivered),
        unsubscribed: mapBuckets(response.buckets.unsubscribed)
      },
      endTime: response.end_time,
      startTime: response.start_time,
      unsubscribeDelivered: response.unsubscribe_delivered,
      unsubscribed: response.unsubscribed
    });

    return result;
  }

  /**
   * Retrieve volume metrics for messages sent from your account, including counts of processed, delivered and dropped events. Supports optional filters for time range and campaign ID.
   * @param options - Options to filter and customize the volume metrics retrieval.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.metrics.volume()
   * ```
   */
  async volume (options?: MetricsOptions): Promise<MetricsVolumeResponse> {
    const result: MetricsVolumeResponse = { data: null, error: null };

    const response = await this.mailchannels.get<MetricsVolumeApiResponse>("/tx/v1/metrics/volume", {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        campaign_id: options?.campaignId,
        interval: options?.interval
      },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch volume metrics.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      buckets: {
        delivered: mapBuckets(response.buckets.delivered),
        dropped: mapBuckets(response.buckets.dropped),
        processed: mapBuckets(response.buckets.processed)
      },
      delivered: response.delivered,
      dropped: response.dropped,
      endTime: response.end_time,
      processed: response.processed,
      startTime: response.start_time
    });

    return result;
  }

  /**
   * Retrieves usage statistics during the current billing period.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.metrics.usage()
   * ```
   */
  async usage (): Promise<MetricsUsageResponse> {
    const result: MetricsUsageResponse = { data: null, error: null };

    const response = await this.mailchannels.get<MetricsUsageApiResponse>("/tx/v1/usage", {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response);
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch usage metrics.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      endDate: response.period_end_date,
      startDate: response.period_start_date,
      total: response.total_usage
    });

    return result;
  }

  /**
   * Retrieves a list of senders, either sub-accounts or campaigns, with their associated message metrics. Sorted by total # of sent messages (processed + dropped). Supports optional filter for time range, and optional settings for limit, offset, and sort order. Note: senders without any messages in the given time range will not be included in the results. The default time range is from one month ago to now, and the default sort order is descending.
   * @param type - The type of senders to retrieve metrics for. Can be either `sub-accounts` or `campaigns`.
   * @param options - Optional filter options for time range, limit, offset, and sort order.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.metrics.senders('campaigns')
   * ```
   */
  async senders (type: MetricsSendersType, options?: MetricsSendersOptions): Promise<MetricsSendersResponse> {
    const result: MetricsSendersResponse = { data: null, error: null };

    result.error =
      validateLimit(options?.limit, 1000) ||
      validateOffset(options?.offset);

    if (result.error) return result;

    const response = await this.mailchannels.get<MetricsSendersApiResponse>(`/tx/v1/metrics/senders/${type}`, {
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        limit: options?.limit,
        offset: options?.offset,
        sort_order: options?.sortOrder
      },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch senders metrics.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      endTime: response.end_time,
      limit: response.limit,
      offset: response.offset,
      senders: response.senders,
      startTime: response.start_time,
      total: response.total
    });

    return result;
  }
}
