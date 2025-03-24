export interface SubAccountsAccount {
  /**
   * If the sub-account is enabled.
   */
  enabled: boolean;
  /**
   * The handle for the sub-account.
   */
  handle: string;
}

export interface SubAccountsCreateResponse {
  account: SubAccountsAccount | null;
  error: string | null;
}
