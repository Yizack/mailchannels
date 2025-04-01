import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/success-response";
import type { ListEntryOptions, ListEntryResponse } from "../types/list-entry";
import type { DomainsAddListEntryApiResponse } from "../types/domains/internal";
import type { DomainsData, DomainsProvisionOptions, DomainsProvisionResponse } from "../types/domains/provision";
import type { DomainsListOptions, DomainsListResponse } from "../types/domains/list";
import type { DomainsCreateLoginLinkResponse } from "../types/domains/create-login-link";
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
   *   domain: 'example.com',
   *   subscriptionHandle: 'your-subscription-handle'
   * })
   * ```
   */
  async provision (options: DomainsProvisionOptions): Promise<DomainsProvisionResponse> {
    const { associateKey, overwrite, ...payload } = options;

    const data: DomainsProvisionResponse = { data: null, error: null };

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
          [ErrorCode.Conflict]: `The domain '${options.domain}' is already provisioned, and is associated with a different customer.`
        });
      }
    }).catch(() => null);

    data.data = response;
    return data;
  }

  /**
   * Fetch a list of all domains associated with this API key.
   * @param options - The options to filter the list of domains.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { domains } = await mailchannels.domains.list()
   * ```
   */
  async list (options?: DomainsListOptions): Promise<DomainsListResponse> {
    const data: DomainsListResponse = { domains: [], total: 0, error: null };

    if (typeof options?.limit === "number" && (options.limit < 1 || options.limit > 5000)) {
      data.error = "The limit value is invalid. Possible limit values are 1 to 5000.";
      return data;
    }

    if (typeof options?.offset === "number" && options.offset < 0) {
      data.error = "Offset must be greater than or equal to 0.";
      return data;
    }

    const response = await this.mailchannels.get<{ domains: DomainsData[], total: number }>("/inbound/v1/domains", {
      query: options,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response);
      }
    }).catch(() => null);

    if (!response) return data;

    data.domains = response.domains;
    data.total = response.total;
    return data;
  }

  /**
   * De-provision a domain to cease protecting it with MailChannels Inbound.
   * @param domain - The domain name to be removed.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.domains.delete('example.com')
   * ```
   */
  async delete (domain: string): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    await this.mailchannels.delete<void>(`/inbound/v1/domains/${domain}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    });

    return data;
  }

  /**
   * Add an entry to a domain blocklist or safelist.
   * @param domain - The domain name.
   * @param options - The options to add a list entry.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entry } = await mailchannels.domains.addListEntry('example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async addListEntry (domain: string, options: ListEntryOptions) {
    const { listName, item } = options;

    const data: ListEntryResponse = { entry: null, error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    const response = await this.mailchannels.post<DomainsAddListEntryApiResponse>(`/inbound/v1/domains/${domain}/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.entry = {
      action: response.action,
      item: response.item,
      type: response.item_type
    };
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
      data.error = "No domain provided.";
      return data;
    }

    const response = await this.mailchannels.get<{ loginLink: string }>(`/inbound/v1/domains/${domain}/login-link`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Unauthorized]: "The domain does not belong to this customer.",
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.link = response.loginLink;
    return data;
  }

  /**
   * Update the API key that is associated with a domain.
   * @param domain - The domain name.
   * @param key - The new API key to associate with this domain.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.domains.updateApiKey('example.com', 'your-api-key')
   * ```
   */
  async updateApiKey (domain: string, key: string): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    if (!key) {
      data.error = "No API key provided.";
      return data;
    }

    await this.mailchannels.put<void>(`/inbound/v1/domains/${domain}/api-key`, {
      body: { apiKey: key },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: "The domain does not exist."
        });
      }
    });

    return data;
  }
}
