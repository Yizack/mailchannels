interface EmailsCheckDomainDkim {
  domain: string;
  privateKey: string;
  selector: string;
}

export interface EmailsCheckDomainOptions {
  dkim: EmailsCheckDomainDkim;
  domain: string;
  senderId: string;
}

type EmailsCheckDomainVerdict = "passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown";

export interface EmailsCheckDomainResponse {
  check_results: {
    spf: {
      verdict: EmailsCheckDomainVerdict;
    };
    domain_lockdown: {
      verdict: Pick<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    dkim: [
      {
        dkim_domain: "mappedlove.com";
        dkim_selector: "mailchannels";
        verdict: Pick<EmailsCheckDomainVerdict, "passed" | "failed">;
      }
    ];
  };
}
