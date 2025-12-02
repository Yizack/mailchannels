import type { MetricsBucket } from ".";

export interface MetricsVolume {
  /**
   * A series of metrics aggregations bucketed by time interval (e.g. hour, day).
   */
  buckets: {
    delivered: MetricsBucket[];
    dropped: MetricsBucket[];
    processed: MetricsBucket[];
  };
  /**
   * Count of messages delivered during the specified time range.
   */
  delivered: number;
  /**
   * Count of messages dropped during the specified time range.
   */
  dropped: number;
  /**
   * The end of the time range for retrieving message volume metrics (exclusive).
   */
  endTime: string;
  /**
   * Count of messages processed during the specified time range.
   */
  processed: number;
  /**
   * The beginning of the time range for retrieving message volume metrics (inclusive).
   */
  startTime: string;
}

export interface MetricsVolumeResponse {
  volume: MetricsVolume | null;
  error: string | null;
}
