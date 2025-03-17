interface CheckDomainDkim {
  domain: string;
  privateKey: string;
  selector: string;
}

export interface CheckDomainOptions {
  dkim: CheckDomainDkim[] | CheckDomainDkim;
  domain: string;
  senderId: string;
}

export interface CheckDomainPayload {
  dkim_settings: {
    dkim_domain: string;
    dkim_private_key: string;
    dkim_selector: string;
  }[];
  domain: string;
  sender_id: string;
}

export type CheckDomainVerdict = "passed" | "failed" | "soft failed" | "temporary error" | "permanent error" | "neutral" | "none" | "unknown";

export interface CheckDomainApiResponse {
  check_results: {
    spf: {
      verdict: CheckDomainVerdict;
    };
    domain_lockdown: {
      verdict: Extract<CheckDomainVerdict, "passed" | "failed">;
    };
    dkim: {
      dkim_domain: string;
      dkim_selector: string;
      verdict: Extract<CheckDomainVerdict, "passed" | "failed">;
    }[];
  };
}

export interface CheckDomainResponse {
  results: {
    spf: {
      verdict: CheckDomainVerdict;
    };
    domainLockdown: {
      verdict: Extract<CheckDomainVerdict, "passed" | "failed">;
    };
    dkim: {
      domain: string;
      selector: string;
      verdict: Extract<CheckDomainVerdict, "passed" | "failed">;
    }[];
  };
  payload: CheckDomainPayload;
}
