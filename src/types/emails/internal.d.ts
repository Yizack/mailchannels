import type { EmailsCheckDomainVerdict } from "./check-domain";
import type { EmailsSendAttachment, EmailsSendRecipient, EmailsSendTracking } from "./send";

interface EmailsSendPersonalization {
  bcc?: EmailsSendRecipient[];
  cc?: EmailsSendRecipient[];
  dkim_domain?: string;
  dkim_private_key?: string;
  dkim_selector?: string;
  dynamic_template_data?: Record<string, unknown>;
  from?: EmailsSendRecipient;
  headers?: Record<string, string>;
  reply_to?: EmailsSendRecipient;
  subject?: string;
  to: EmailsSendRecipient[];
}

export interface EmailsSendContent {
  template_type?: "mustache";
  type: "text/html" | "text/plain";
  value: string;
}

export interface EmailsSendPayload {
  attachments?: EmailsSendAttachment[];
  content: EmailsSendContent[];
  from: EmailsSendRecipient;
  headers?: Record<string, string>;
  mailfrom?: EmailsSendRecipient;
  personalizations: EmailsSendPersonalization[];
  reply_to?: EmailsSendRecipient;
  subject: string;
  tracking_settings?: {
    click_tracking?: {
      enable: EmailsSendTracking["click"];
    };
    open_tracking?: {
      enable: EmailsSendTracking["open"];
    };
  };
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
