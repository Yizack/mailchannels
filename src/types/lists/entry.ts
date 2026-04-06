import type { DataResponse } from "../responses";

export type ListNames = "blocklist" | "safelist" | "blacklist" | "whitelist";

export interface ListEntryOptions {
  /**
   * This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   */
  listName: ListNames;
  /**
   *  This can be a domain, email address, or IP address. The type of the entry is automatically determined based on the value.
   */
  item: string;
}

export interface ListEntry {
  action: Extract<ListNames, "blocklist" | "safelist">;
  item: string;
  type: "domain" | "email_address" | "ip_address";
}

export type ListEntryResponse = DataResponse<ListEntry>;

export type ListEntriesResponse = DataResponse<ListEntry[]>;
