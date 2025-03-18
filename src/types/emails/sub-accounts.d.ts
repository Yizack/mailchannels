export interface SubAccountsListOptions {
  /**
   * Possible values: >= 1 and <= 1000
   * @default 1000
   */
  limit?: number;
  /**
   * @default 0
   */
  offset?: number;
}

export interface SubAccountsListResponse {
  accounts: {
    enabled: boolean;
    handle: string;
  }[];
}
