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
  campaign_id?: string;
  content: EmailsSendContent[];
  from: EmailsSendRecipient;
  headers?: Record<string, string>;
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
  transactional?: boolean;
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
    dkim: {
      dkim_domain: string;
      dkim_selector: string;
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
    domain_lockdown: {
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    spf: {
      reason?: string;
      verdict: EmailsCheckDomainVerdict;
    };
  };
  references?: string[];
}
