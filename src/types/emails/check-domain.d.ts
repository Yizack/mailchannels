import type { EmailsDkimKey } from "./create-dkim-key";

interface EmailsCheckDomainDkim {
  /**
   * Domain used for DKIM signing.
   */
  domain?: string;
  /**
   * DKIM private key encoded in Base64.
   */
  privateKey?: string;
  /**
   * DKIM selector in the domain DNS records.
   */
  selector?: string;
}

export interface EmailsCheckDomainOptions {
  /**
   * Each item may include DKIM `domain`, `selector` and `privateKey`. Up to 10 items are allowed. The absence or presence of these fields affects how DKIM settings are validated:
   * - If `domain`, `selector`, and `privateKey` are all present, verify using the provided domain, selector, and key.
   * - If `domain` and `selector` are present, use the stored private key for the given domain and selector.
   * - If only `domain` is present, use all stored keys for the given domain.
   * - If none are present, use all stored keys for the `domain` provided in the domain field of the request.
   * - If `privateKey` is present, `selector` must be present.
   * - If `selector` is present and `domain` is not, the domain will be taken from the domain field of the request.
   */
  dkim?: EmailsCheckDomainDkim[] | EmailsCheckDomainDkim;
  /**
   * Domain used for sending emails. If `dkim` settings are not provided, or `dkim` settings are provided with no `domain`, the stored dkim settings for this domain will be used.
   */
  domain: string;
  /**
   * Used exclusively for [Domain Lockdown](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown) verification. If you're not using senderid to associate your domain with your account, you can disregard this field. The corresponding value is included in the `X-MailChannels-SenderId` header of emails sent via MailChannels.
   */
  senderId?: string;
}

export type EmailsCheckDomainVerdict = "passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown";

export interface EmailsCheckDomainResponse {
  /**
   * The results of the domain checks.
   */
  results: {
    dkim: {
      domain: string;
      /**
       * The human readable status of the DKIM key used for verification.
       */
      keyStatus?: EmailsDkimKey["status"] | "provided";
      selector: string;
      /**
       * A human-readable explanation of DKIM check.
       */
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
    domainLockdown: {
      /**
       * A human-readable explanation of Domain Lockdown check.
       */
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    /**
     * These results are here to help avoid [SDNF](https://support.mailchannels.com/hc/en-us/articles/203155500-550-5-2-1-SDNF-Sender-Domain-Not-Found) (Sender Domain Not Found) blocks. For messages not to get blocked by SDNF, we require either an MX or A record to exist for the sender domain.
     */
    senderDomain: {
      a: {
        /**
         * A human-readable explanation of A record check.
         */
        reason?: string;
        verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
      };
      mx: {
        /**
         * A human-readable explanation of MX record check.
         */
        reason?: string;
        verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
      };
      /**
       * Overall verdict. Passed if either A or MX record check passed.
       */
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    spf: {
      /**
       * A human-readable explanation of SPF check.
       */
      reason?: string;
      verdict: EmailsCheckDomainVerdict;
    };
    references?: string[];
  } | null;
  /**
   * Link to SPF, Domain Lockdown or DKIM references, displayed if any verdict is not passed.
   */
  error: string | null;
}
