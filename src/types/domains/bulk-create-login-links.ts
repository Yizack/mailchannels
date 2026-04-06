import type { DataResponse } from "../responses";

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
  /**
   * If a user browses to this URL, they will be automatically logged in as a domain admin.
   */
  loginLink: string;
}

export interface DomainsBulkCreateLoginLinks {
  successes: DomainsBulkCreateLoginLinkResult[];
  errors: Omit<DomainsBulkCreateLoginLinkResult, "loginLink">[];
}

export type DomainsBulkCreateLoginLinksResponse = DataResponse<DomainsBulkCreateLoginLinks>;
