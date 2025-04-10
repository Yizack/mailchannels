export interface DomainsListDownstreamAddressesOptions {
  /**
   * The number of records to return.
   * @default 10
   */
  limit?: number;
  /**
   * The offset into the records to return.
   * @default 0
   */
  offset?: number;
}

export interface DomainsDownstreamAddress {
  port: number;
  priority: number;
  target: string;
  weight: number;
}

export interface DomainsListDownstreamAddressesResponse {
  records: DomainsDownstreamAddress[];
  error: string | null;
}
