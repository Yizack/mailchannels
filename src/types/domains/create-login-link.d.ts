import type { DataResponse } from "../responses";

export interface DomainsCreateLoginLink {
  /**
   * If a user browses to this URL, they will be automatically logged in as a domain admin.
   */
  link: string;
}

export type DomainsCreateLoginLinkResponse = DataResponse<DomainsCreateLoginLink>;
