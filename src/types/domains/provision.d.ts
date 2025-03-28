export interface DomainsData {
  /**
   * The domain name.
   */
  domain: string;
  /**
   * The subscription `handle` that identifies the subscription that this domain should be provisioned against. Subscription handles can be retrieved from the `subscriptions` service method.
   */
  subscriptionHandle: string;
  /**
   * The abuse policy settings for the domain. These settings determine how spam messages are handled.
   */
  settings?: Partial<{
    /**
     * The abuse policy.
     */
    abusePolicy: "block" | "flag" | "quarantine";
    /**
     * If `true`, this abuse policy overrides the recipient abuse policy.
     */
    abusePolicyOverride: boolean;
    /**
     * The spam header name to use if the abuse policy is set to `flag`.
     */
    spamHeaderName: string;
    /**
     * The spam header value to use if the abuse policy is set to `flag`.
     */
    spamHeaderValue: string;
  }>;
  /**
   * A list of email addresses that are the domain admins for the domain.
   */
  admins?: string[];
  /**
   * The locations of mail servers to which messages will be delivered after filtering.
   */
  downstreamAddresses?: {
    /**
     * The priority of the downstream address. Only addresses with the highest priority (the lowest numerical value) are selected.
     */
    priority: number;
    /**
     * Downstream addresses are selected in proportion to their weights. For example, if there are two downstream addresses, A with weight 40, and B with weight 10, then A is selected 80% of the time and B is selected 20% of the time.
     */
    weight: number;
    /**
     * TCP port on which the downstream mail server is listening.
     */
    port: number;
    /**
     * The canonical hostname of the host providing the service, ending in a dot.
     */
    target: string;
  }[];
  /**
   * A list of aliases for the domain. Mail is accepted for these domains and routed to the `downstreamAddresses` defined for the domain. Must be <= 255 characters
   */
  aliases?: string[];
}

export interface DomainsProvisionOptions extends DomainsData {
  /**
   * If present and set to true, the domain will be associated with the api-key that created it. This means that this api-key must be used for inbound-api actions involving this domain (for example adding safe/block list entries, etc).
   */
  associateKey?: boolean;
  /**
   * If present and set to true, the settings (domain settings, downstream addresses, aliases and admins) for the domain will be overwritten with the ones in the request if the domain already exists, unless a section is not included in the request or there is problem updating a setting in which case the previous settings are carried forward.
   */
  overwrite?: boolean;
}

export interface DomainsProvisionResponse {
  data: DomainsData | null;
  error: ErrorCode | null;
}
