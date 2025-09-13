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
