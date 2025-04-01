export interface UsersCreateApiResponse {
  recipient: {
    email_address: string;
    roles: string[];
    filter?: boolean;
  };
  list_entries: {
    item: string;
    item_type: "domain" | "email_address" | "ip_address";
    action: "safelist" | "blocklist";
  }[];
}

export interface UsersAddListEntryApiResponse {
  action: "blocklist" | "safelist";
  item: string;
  item_type: "domain" | "email_address" | "ip_address";
}
