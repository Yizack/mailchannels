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
  check_results: {
    spf: {
      verdict: EmailsCheckDomainVerdict;
    };
    domain_lockdown: {
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    dkim: {
      dkim_domain: "mappedlove.com";
      dkim_selector: "mailchannels";
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
  };
}
