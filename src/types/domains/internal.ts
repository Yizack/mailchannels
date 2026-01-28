export interface DomainsAddListEntryApiResponse {
  action: "blocklist" | "safelist";
  item: string;
  item_type: "domain" | "email_address" | "ip_address";
}
