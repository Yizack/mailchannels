export interface DomainsCreateLoginLinkResponse {
  /**
   * If a user browses to this URL, they will be automatically logged in as a domain admin.
   */
  link: string | null;
  error: string | null;
}
