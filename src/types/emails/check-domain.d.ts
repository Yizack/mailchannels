interface EmailsCheckDomainDkim {
  domain: string;
  privateKey: string;
  selector: string;
}

export interface EmailsCheckDomainOptions {
  dkim: EmailsCheckDomainDkim[] | EmailsCheckDomainDkim;
  domain: string;
  senderId: string;
}

export type EmailsCheckDomainVerdict = "passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown";

export interface EmailsCheckDomainResponse {
  results: {
    spf: {
      verdict: EmailsCheckDomainVerdict;
    };
    domainLockdown: {
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    dkim: {
      domain: string;
      selector: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
  };
}
