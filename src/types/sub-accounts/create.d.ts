export interface SubAccountsAccount {
  enabled: boolean;
  handle: string;
}

export interface SubAccountsCreateResponse {
  account: SubAccountsAccount;
}
