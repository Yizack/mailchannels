import type { MailChannelsClient } from "../client";
import type { DomainsCreateLoginLinkResponse } from "../types/domains/create-login-link";
import type { DomainsData, DomainsProvisionOptions, DomainsProvisionResponse } from "../types/domains/provision";
import { ErrorCode, getStatusError } from "../utils/errors";

export class Domains {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Provision a single domain to use MailChannels Inbound.
   * @param options - The domain data to provision.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data } = await mailchannels.domains.provision({
   * // options
   * })
   * ```
   */
  async provision (options: DomainsProvisionOptions): Promise<DomainsProvisionResponse> {
    const data: DomainsProvisionResponse = { data: null, error: null };

    const { associateKey, overwrite, ...payload } = options;

    const response = await this.mailchannels.post<DomainsData>("/inbound/v1/domains", {
      query: {
        "associate-key": associateKey,
        "overwrite": overwrite
      },
      body: payload,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request, returned in the case that an error occurs while converting an A-label domain to a U-label domain name.",
          [ErrorCode.Forbidden]: "The limit on associated domains is reached or you are attempting to associate a domain with a subscription that is not your own.",
          [ErrorCode.Conflict]: "The domain is already provisioned, and is associated with a different customer."
        });
      }
    }).catch(() => null);

    data.data = response;
    return data;
  }

  /**
   * Generate a link that allows a user to log in as a domain administrator.
   * @param domain - The domain name.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { link } = await mailchannels.domains.createLoginLink('example.com')
   * ```
   */
  async createLoginLink (domain: string): Promise<DomainsCreateLoginLinkResponse> {
    const data: DomainsCreateLoginLinkResponse = { link: null, error: null };

    if (!domain) {
      data.error = "The domain is required.";
      return data;
    }

    const response = await this.mailchannels.get<{ loginLink: string }>(`/inbound/v1/domains/${domain}/login-link`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Unauthorized]: "The domain does not belong to this customer.",
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: "The domain does not exist."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.link = response.loginLink;
    return data;
  }
}
