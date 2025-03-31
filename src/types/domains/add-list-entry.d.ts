type DomainsListNames = "blocklist" | "safelist" | "blacklist" | "whitelist";

export interface DomainsAddListEntryOptions {
  /**
   * The list to add the item to. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   */
  listName: DomainsListNames;
  /**
   * The item to add to the list. This can be a domain, email address, or IP address.
   */
  item: string;
}

export interface DomainsAddListEntryResponse {
  entry: {
    action: Extract<DomainsListNames, "blocklist" | "safelist">;
    item: string;
    type: "domain" | "email_address" | "ip_address";
  } | null;
  error: string | null;
}
