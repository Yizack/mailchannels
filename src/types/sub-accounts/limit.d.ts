export interface SubAccountsLimit {
  sends: number;
}

export interface SubAccountsLimitResponse {
  limit: SubAccountsLimit | null;
  error: string | null;
}
