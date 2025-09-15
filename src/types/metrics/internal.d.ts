export interface MetricsEngagementApiResponse {
  buckets: {
    click: {
      count: number;
      period_start: string;
    }[];
    click_tracking_delivered: {
      count: number;
      period_start: string;
    }[];
    open: {
      count: number;
      period_start: string;
    }[];
    open_tracking_delivered: {
      count: number;
      period_start: string;
    }[];
  };
  click: number;
  click_tracking_delivered: number;
  end_time: string;
  open: number;
  open_tracking_delivered: number;
  start_time: string;
}

export interface MetricsPerformanceApiResponse {
  bounced: number;
  buckets: {
    bounced: {
      count: number;
      period_start: string;
    }[];
    delivered: {
      count: number;
      period_start: string;
    }[];
    processed: {
      count: number;
      period_start: string;
    }[];
  };
  delivered: number;
  end_time: string;
  processed: number;
  start_time: string;
}
