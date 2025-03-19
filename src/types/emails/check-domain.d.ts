interface EmailsCheckDomainDkim {
  /**
   * Domain used for DKIM signing
   */
  domain: string;
  /**
   * DKIM private key encoded in Base64
   */
  privateKey: string;
  /**
   * DKIM selector in the domain DNS records
   */
  selector: string;
}

export interface EmailsCheckDomainOptions {
  /**
   * Up to 10 DKIM checks are allowed
   */
  dkim: EmailsCheckDomainDkim[] | EmailsCheckDomainDkim;
  /**
   * Domain used for sending emails
   */
  domain: string;
  /**
   * `X-MailChannels-Sender-Id` header value in emails via MailChannels
   */
  senderId: string;
}

export type EmailsCheckDomainVerdict = "passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown";

export interface EmailsCheckDomainResponse {
  /**
   * The results of the domain checks
   */
  results: {
    dkim: {
      domain: string;
      selector: string;
      /**
       * A human-readable explanation of DKIM check
       */
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
    domainLockdown: {
      /**
       * A human-readable explanation of Domain Lockdown check
       */
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    spf: {
      /**
       * A human-readable explanation of SPF check
       */
      reason?: string;
      verdict: EmailsCheckDomainVerdict;
    };
  };
  /**
   * Link to SPF, Domain Lockdown or DKIM references, displayed if any verdict is not passed.
   */
  references?: string[];
}
