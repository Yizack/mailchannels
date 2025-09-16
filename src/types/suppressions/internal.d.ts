import type { SuppressionsSource, SuppressionsTypes } from ".";

export interface SuppressionsCreatePayload {
  add_to_sub_accounts?: boolean;
  suppression_entries: {
    notes?: string;
    recipient: string;
    suppression_types?: SuppressionsTypes[];
  }[];
}

export interface SuppressionsListPayload {
  recipient?: string;
  source?: SuppressionsSource;
  created_before?: string;
  created_after?: string;
  limit?: number;
  offset?: number;
}

export interface SuppressionsListApiResponse {
  suppression_list: {
    created_at: string;
    notes?: string;
    recipient: string;
    sender?: string;
    source: SuppressionsSource;
    suppression_types: SuppressionsTypes[];
  }[];
}
