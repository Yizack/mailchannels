export interface SubAccountsUsage {
  /**
   * The end date of the current billing period (ISO 8601 format).
   * @example "2025-04-11"
   */
  endDate?: string;
  /**
   * The start date of the current billing period (ISO 8601 format).
   * @example "2025-03-12"
   */
  startDate?: string;
  /**
   * The total usage for the current billing period.
   */
  total: number;
}

export interface SubAccountsUsageResponse {
  usage: SubAccountsUsage | null;
  error: string | null;
}
