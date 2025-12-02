import type { MetricsBucket } from ".";

export interface MetricsEngagement {
  /**
   * A series of metrics aggregations bucketed by time interval (e.g. hour, day).
   */
  buckets: {
    click: MetricsBucket[];
    clickTrackingDelivered: MetricsBucket[];
    open: MetricsBucket[];
    openTrackingDelivered: MetricsBucket[];
  };
  click: number;
  clickTrackingDelivered: number;
  endTime: string;
  open: number;
  openTrackingDelivered: number;
  startTime: string;
}

import type { DataResponse } from "../responses";

export type MetricsEngagementResponse = DataResponse<MetricsEngagement>;
