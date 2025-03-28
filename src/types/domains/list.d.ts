import type { DomainsData } from "./provision";

export interface DomainsListOptions {
  /**
   * A list of domains to fetch. If this parameter is present, only domains whose name matches an item in this list are returned.
   */
  domains?: string[];
  /**
   * The maximum number of domains included in the response. Possible values are 1 to 5000
   * @default 10
   */
  limit?: number;
  /**
   * Offset into the list of domains to return.
   * @default 0
   */
  offset?: number;
}

export interface DomainsListResponse {
  /**
   * A list of domains
   */
  domains: DomainsData[];
  /**
   * The total number of domains that are accessible with the given API key that match the list of domains in the 'domains' parameter. If there is no 'domains' parameter, this field is the total number of domains that are accessible with with this API key. A domain is accessible with a given API key if it is associated with that API key, or if it is not associated with any API key.
   */
  total: number;
  error: string | null;
}
