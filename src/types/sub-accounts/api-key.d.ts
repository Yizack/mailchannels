export interface SubAccountsApiKey {
  /**
   * The API key ID for the sub-account.
   */
  id: number;
  /**
   * API key for the sub-account.
   */
  value: string;
}

export interface SubAccountsCreateApiKeyResponse {
  key: SubAccountsApiKey | null;
  error: string | null;
}

export interface SubAccountsListApiKeyResponse {
  keys: SubAccountsApiKey[];
  error: string | null;
}
