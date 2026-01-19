import type { EmailsCheckDomainVerdict } from "./check-domain";
import type { EmailsSendAttachment, EmailsSendRecipient, EmailsSendTracking } from "./send";
import type { EmailsDkimKey } from "./create-dkim-key";

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

export interface EmailsSendApiResponse {
  data?: string[];
  request_id?: string;
  results?: {
    index?: number;
    message_id: string;
    reason?: string;
    status: "sent" | "failed";
  }[];
}

export interface EmailsSendAsyncApiResponse {
  queued_at: string;
  request_id: string;
}

export interface EmailsCheckDomainPayload {
  dkim_settings?: {
    dkim_domain?: string;
    dkim_private_key?: string;
    dkim_selector?: string;
  }[];
  domain: string;
  sender_id?: string;
}

export interface EmailsCheckDomainApiResponse {
  check_results: {
    dkim: {
      dkim_domain: string;
      dkim_key_status?: EmailsDkimKey["status"] | "provided";
      dkim_selector: string;
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    }[];
    domain_lockdown: {
      reason?: string;
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    sender_domain: {
      a: {
        reason?: string;
        verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
      };
      mx: {
        reason?: string;
        verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
      };
      verdict: Extract<EmailsCheckDomainVerdict, "passed" | "failed">;
    };
    spf: {
      reason?: string;
      verdict: EmailsCheckDomainVerdict;
    };
  };
  references?: string[];
}

export interface EmailsCreateDkimKeyPayload {
  algorithm?: "rsa";
  key_length?: 1024 | 2048 | 4096 | 3072 | 4096;
  selector: string;
}

export interface EmailsCreateDkimKeyApiResponse {
  algorithm: string;
  created_at?: string;
  dkim_dns_records: {
    name: string;
    type: string;
    value: string;
  }[];
  domain: string;
  gracePeriodExpiresAt?: string;
  key_length: 1024 | 2048 | 4096 | 3072 | 4096;
  public_key: string;
  retiresAt?: string;
  selector: string;
  status: EmailsDkimKey["status"];
  status_modified_at?: string;
}

export interface EmailsGetDkimKeysPayload {
  selector?: string;
  status?: EmailsDkimKey["status"];
  offset?: number;
  limit?: number;
  include_dns_record?: boolean;
}

export interface EmailsRotateDkimKeyApiResponse {
  new_key: EmailsCreateDkimKeyApiResponse;
  rotated_key: EmailsCreateDkimKeyApiResponse;
}
