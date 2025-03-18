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

export interface EmailsCheckDomainPayload {
  dkim_settings: {
    dkim_domain: string;
    dkim_private_key: string;
    dkim_selector: string;
  }[];
  domain: string;
  sender_id: string;
}

export type EmailsCheckDomainVerdict = "passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown";

export interface EmailsCheckDomainApiResponse {
  check_results: {
    spf: {
      verdict: EmailsCheckDomainVerdict;
    };
    domain_lockdown: {
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    dkim: {
      dkim_domain: string;
      dkim_selector: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
  };
}

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
  payload: EmailsCheckDomainPayload;
}
