import type { SuppressionsTypes } from "./create";

export type SuppressionsSource = "api" | "unsubscribe_link" | "list_unsubscribe" | "hard_bounce" | "spam_complaint" | "all";

export interface SuppressionsListOptions {
  /**
   * The email address of the suppression entry to search for. If provided, the search will return the suppression entry associated with this recipient. If not provided, the search will return all suppression entries for the account.
   */
  recipient?: string;
  /**
   * The source of the suppression entries to filter by. If not provided, suppression entries from all sources will be returned.
   */
  source?: Exclude<SuppressionsSource, "all">;
  /**
   * The date and/or time before which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
   */
  createdBefore?: string;
  /**
   * The date and/or time after which the suppression entries were created. Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
   */
  createdAfter?: string;
  /**
   * The maximum number of suppression entries to return. Must be between `1` and `1000`.
   * @default 1000
   */
  limit?: number;
  /**
   * The number of suppression entries to skip before returning results.
   * @default 0
   */
  offset?: number;
}

export interface SuppressionsListEntry {
  createdAt: string;
  notes?: string;
  /**
   * The email address that is suppressed.
   */
  recipient: string;
  sender?: string;
  source: SuppressionsSource;
  types: SuppressionsTypes[];
}

export interface SuppressionsListResponse {
  list: SuppressionsListEntry[];
  error: string | null;
}
