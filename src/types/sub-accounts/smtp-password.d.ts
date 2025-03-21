export interface SubAccountsSmtpPassword {
  /**
   * Whether the SMTP password is enabled
   */
  enabled: boolean;
  /**
   * The SMTP password ID for the sub-account
   */
  id: number;
  /**
   * SMTP password for the sub-account
   */
  password: string;
}
