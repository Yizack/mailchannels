export type MetricsSenderType = "campaigns" | "sub-accounts";

export interface MetricsSenderOptions {
  /**
   * The beginning of the time range for retrieving top sender metrics (inclusive).
   */
  startTime?: string;
  /**
   * The end of the time range for retrieving top sender metrics (exclusive).
   */
  endTime?: string;
  /**
   * The maximum number of senders to return.
   */
  limit?: number;
  /**
   * The number of senders to skip before returning results.
   */
  offset?: number;
  /**
   * Sort order by total messages.
   * @default "desc"
   */
  sortOrder?: "asc" | "desc";
}

export interface MetricsSender {
  bounced: number;
  delivered: number;
  dropped: number;
  name: string;
  processed: number;
}

export interface MetricsSenderResponse {
  endTime?: string;
  error: string | null;
  limit: number;
  offset: number;
  senders: MetricsSender[];
  startTime?: string;
  total: number;
}
