export interface SubAccountsCreateSmtpPasswordApiResponse {
  enabled: boolean;
  id: number;
  smtp_password: string;
}

export interface SubAccountsCreateApiResponse {
  company_name: string;
  enabled: boolean;
  handle: string;
}

export type SubAccountsListApiResponse = SubAccountsCreateApiResponse[];

export interface SubAccountsUsageApiResponse {
  period_end_date: string;
  period_start_date: string;
  total_usage: number;
}
