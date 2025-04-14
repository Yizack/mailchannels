export interface ServiceReportOptions {
  /**
   * The report type. It can be either `false_negative` or `false_positive`.
   */
  type: "false_negative" | "false_positive";
  /**
   * The full, unaltered message content in accordance with the RFC 2822 specifications without dot stuffing.
   */
  messageContent: string;
  /**
   * The SMTP envelope information
   */
  smtpEnvelopeInformation?: {
    ehlo: string;
    mailFrom: string;
    rcptTo: string;
  };
  /**
   * The sending host information.
   */
  sendingHostInformation?: {
    name: string;
  };
}
