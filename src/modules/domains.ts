import type { MailChannelsClient } from "../client";
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
   * const { data, error } = await mailchannels.domains.provision({
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
        data.error = getStatusError(response.status, {
          [ErrorCode.BadRequest]: "Bad Request, returned in the case that an error occurs while converting an A-label domain to a U-label domain name.",
          [ErrorCode.Forbidden]: "The limit on associated domains is reached or you are attempting to associate a domain with a subscription that is not your own.",
          [ErrorCode.Conflict]: "The domain is already provisioned, and is associated with a different customer.",
          [ErrorCode.UnprocessableEntity]: response._data?.message || "Not valid response from the server."
        });
      }
    }).catch(() => null);

    data.data = response;
    return data;
  }
}
