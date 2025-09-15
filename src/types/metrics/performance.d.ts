import type { MetricsBucket } from ".";

export interface MetricsPerformance {
  /**
   * Count of messages bounced during the specified time range.
   */
  bounced: number;
  buckets: {
    bounced: MetricsBucket[];
    delivered: MetricsBucket[];
    processed: MetricsBucket[];
  };
  /**
   * Count of messages delivered during the specified time range.
   */
  delivered: number;
  /**
   * The end of the time range for retrieving message performance metrics (exclusive).
   */
  endTime: string;
  /**
   * Count of messages processed during the specified time range.
   */
  processed: number;
  /**
   * The beginning of the time range for retrieving message performance metrics (inclusive).
   */
  startTime: string;
}

export interface MetricsPerformanceResponse {
  performance: MetricsPerformance | null;
  error: string | null;
}
