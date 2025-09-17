interface DomainsBulkCreateLoginLinkResult {
  /**
   * The domain the request was for.
   */
  domain: string;
  code: 200 | 400 | 401 | 403 | 404 | 500;
  /**
   * More information about the result of creating the login link.
   */
  comment?: string;
}

export interface DomainsBulkCreateLoginLink {
  successes: DomainsBulkCreateLoginLinkResult & {
    /**
     * If a user browses to this URL, they will be automatically logged in as a domain admin.
     */
    loginLink: string;
  }[];
  errors: DomainsBulkCreateLoginLinkResult[];
}

export interface DomainsBulkCreateLoginLinksResponse {
  results: DomainsCreateLoginLink[];
  error: string | null;
}
