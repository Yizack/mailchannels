export interface MetricsEngagement {
  buckets: {
    click: {
      count: number;
      periodStart: string;
    }[];
    clickTrackingDelivered: {
      count: number;
      periodStart: string;
    }[];
    open: {
      count: number;
      periodStart: string;
    }[];
    openTrackingDelivered: {
      count: number;
      periodStart: string;
    }[];
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
