export * from "./engagement";
export * from "./performance";
export * from "./recipient-behaviour";
export * from "./volume";
export * from "./usage";

export interface MetricsBucket {
  /**
   * The number of events or occurrences aggregated within this time period.
   */
  count: number;
  /**
   * The starting date and time of the time period this bucket represents.
   */
  periodStart: string;
}

export interface MetricsOptions {
  /**
   * The beginning of the time range for retrieving message metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to one month ago if not provided.
   * @example "2025-05-26"
   */
  startTime?: string;
  /**
   * The end of the time range for retrieving message metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`. Defaults to the current time if not provided.
   * @example "2025-05-31T15:16:17Z"
   */
  endTime?: string;
  /**
   * The ID of the campaign to filter metrics by. If not provided, metrics for all campaigns will be returned.
   */
  campaignId?: string;
  /**
   * The interval for aggregating metrics data.
   * @default "day"
   */
  interval?: "hour" | "day" | "week" | "month";
}
