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
  /**
   * TCP port on which the downstream mail server is listening.
   */
  port: number;
  /**
   * The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
   */
  priority: number;
  /**
   * The canonical hostname of the host providing the service, ending in a dot.
   */
  target: string;
  /**
   * Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
   */
  weight: number;
}

export interface DomainsListDownstreamAddressesResponse {
  records: DomainsDownstreamAddress[];
  error: string | null;
}
