import type { MetricsBucket } from ".";

export interface MetricsPerformance {
  /**
   * Count of messages bounced during the specified time range.
   */
  bounced: number;
  /**
   * A series of metrics aggregations bucketed by time interval (e.g. hour, day).
   */
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

import type { DataResponse } from "../responses";

export type MetricsPerformanceResponse = DataResponse<MetricsPerformance>;
