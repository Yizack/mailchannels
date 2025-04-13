import type { DomainsData, DomainsProvisionOptions } from "./provision";

export interface DomainsAddListEntryApiResponse {
  action: "blocklist" | "safelist";
  item: string;
  item_type: "domain" | "email_address" | "ip_address";
}

export type DomainsBulkProvisionApiResponse = DomainsData & Pick<DomainsProvisionOptions, "subscriptionHandle">;
