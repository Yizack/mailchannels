type ListNames = "blocklist" | "safelist" | "blacklist" | "whitelist";

export interface ListEntryOptions {
  /**
   * The list to add the item to. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   */
  listName: ListNames;
  /**
   * The item to add to the list. This can be a domain, email address, or IP address. The type of the entry is automatically determined based on the value.
   */
  item: string;
}

export interface ListEntry {
  action: Extract<ListNames, "blocklist" | "safelist">;
  item: string;
  type: "domain" | "email_address" | "ip_address";
}

export interface ListEntryResponse {
  entry: ListEntry | null;
  error: string | null;
}

export interface ListEntriesResponse {
  entries: ListEntry[];
  error: string | null;
}
