import type { MetricsBucket } from ".";

export interface MetricsEngagement {
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

export interface MetricsEngagementResponse {
  engagement: MetricsEngagement | null;
  error: string | null;
}
