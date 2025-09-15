interface MetricsApiBucket {
  count: number;
  period_start: string;
}

export interface MetricsEngagementApiResponse {
  buckets: {
    click: MetricsApiBucket[];
    click_tracking_delivered: MetricsApiBucket[];
    open: MetricsApiBucket[];
    open_tracking_delivered: MetricsApiBucket[];
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
    bounced: MetricsApiBucket[];
    delivered: MetricsApiBucket[];
    processed: MetricsApiBucket[];
  };
  delivered: number;
  end_time: string;
  processed: number;
  start_time: string;
}

export interface MetricsRecipientBehaviourApiResponse {
  buckets: {
    unsubscribe_delivered: MetricsApiBucket[];
    unsubscribed: MetricsApiBucket[];
  };
  end_time: string;
  start_time: string;
  unsubscribe_delivered: number;
  unsubscribed: number;
}
