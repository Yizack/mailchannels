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

export interface SubAccountsListApiKeyOptions {
  /**
   * The maximum number of API keys included in the response. Possible values are `1` to `1000`.
   * @default 100
   */
  limit?: number;
  /**
   * Offset into the list of API keys to return.
   * @default 0
   */
  offset?: number;
}

export interface SubAccountsListApiKeyResponse {
  keys: SubAccountsApiKey[];
  error: string | null;
}
