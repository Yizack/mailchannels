export interface SubAccountsSmtpPassword {
  /**
   * Whether the SMTP password is enabled.
   */
  enabled: boolean;
  /**
   * The SMTP password ID for the sub-account.
   */
  id: number;
  /**
   * SMTP password for the sub-account.
   */
  value: string;
}

export interface SubAccountsCreateSmtpPasswordResponse {
  password: SubAccountsSmtpPassword | null;
  error: string | null;
}

export interface SubAccountsListSmtpPasswordResponse {
  passwords: SubAccountsSmtpPassword[];
  error: string | null;
}
