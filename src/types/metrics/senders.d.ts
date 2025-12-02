export type MetricsSendersType = "sub-accounts" | "campaigns";

export interface MetricsSendersOptions {
  /**
   * The beginning of the time range for retrieving top senders metrics (inclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ` Defaults to one month ago if not provided.
   * @example "2025-11-02T03:13:35.761763554Z"
   */
  startTime?: string;
  /**
   * The end of the time range for retrieving top senders metrics (exclusive). Formats: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ` Defaults to the current time if not provided.
   * @example "2025-12-02T03:13:35.761763554Z"
   */
  endTime?: string;
  /**
   * The maximum number of senders to return. Possible values are 1 to 1000.
   * @default 10
   */
  limit?: number;
  /**
   * The number of senders to skip before returning results.
   * @default 0
   */
  offset?: number;
  /**
   * The order in which to sort the results, based on total messages (processed + dropped).
   * @default "desc"
   */
  sortOrder?: "asc" | "desc";
}

export interface MetricsSenders {
  endTime: string;
  limit: number;
  offset: number;
  senders: {
    bounced: number;
    delivered: number;
    dropped: number;
    /**
     * Maximum character length: 255
     */
    name: string;
    processed: number;
  }[];
  startTime: string;
  /**
   * The total number of senders in this category that sent messages in the given time range.
   */
  total: number;
}

export interface MetricsSendersResponse {
  senders: MetricsSenders | null;
  error: string | null;
}
