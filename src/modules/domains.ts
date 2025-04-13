import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/success-response";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames } from "../types/list-entry";
import type { DomainsAddListEntryApiResponse } from "../types/domains/internal";
import type { DomainsData, DomainsProvisionOptions, DomainsProvisionResponse } from "../types/domains/provision";
import type { DomainsListOptions, DomainsListResponse } from "../types/domains/list";
import type { DomainsCreateLoginLinkResponse } from "../types/domains/create-login-link";
import { ErrorCode, getStatusError } from "../utils/errors";
import type { ListEntryApiResponse } from "../types/internal";
import type { DomainsDownstreamAddress, DomainsListDownstreamAddressesOptions, DomainsListDownstreamAddressesResponse } from "../types";

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

    if (!listName) {
      data.error = "No list name provided.";
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
   * Get domain list entries.
   * @param domain - The domain name.
   * @param listName - The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entries } = await mailchannels.domains.listEntries('example.com', 'safelist')
   * ```
   */
  async listEntries (domain: string, listName: ListNames): Promise<ListEntriesResponse> {
    const data: ListEntriesResponse = { entries: [], error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    const response = await this.mailchannels.get<ListEntryApiResponse[]>(`/inbound/v1/domains/${domain}/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.entries = response.map(({ action, item, item_type }) => ({
      action,
      item,
      type: item_type
    }));
    return data;
  }

  /**
   * Delete item from domain list.
   * @param email - The domain name whose list will be modified.
   * @param options - The options for the list entry to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.domains.deleteListEntry('example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async deleteListEntry (domain: string, options: ListEntryOptions): Promise<SuccessResponse> {
    const { listName, item } = options;

    const data: SuccessResponse = { success: false, error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    await this.mailchannels.delete(`/inbound/v1/domains/${domain}/lists/${listName}`, {
      query: { item },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    });

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
   * Sets the list of downstream addreses for the domain. This action deletes any existing downstream address for the domain before creating new ones. If the `records` parameter is an empty array, all downstream address records will be deleted.
   * @param domain - The domain name.
   * @param records - The list of records to set for the domain. A maximum of 10 records can be set.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.domains.setDownstreamAddress('example.com', [
   *   {
   *     port: 25,
   *     priority: 10,
   *     target: 'example.com.',
   *     weight: 10
   *   }
   * ])
   * ```
   */
  async setDownstreamAddress (domain: string, records: DomainsDownstreamAddress[] = []): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    if (records.length > 10) {
      data.error = "The maximum of records to be set is 10.";
      return data;
    }

    await this.mailchannels.put<void>(`/inbound/v1/domains/${domain}/downstream-address`, {
      body: { records },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    });

    return data;
  }

  /**
   * Retrieve stored downstream addresses for the domain.
   * @param domain - The domain name.
   * @param options - The options to filter the list of downstream addresses.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { records } = await mailchannels.domains.listDownstreamAddresses('example.com')
   * ```
   */
  async listDownstreamAddresses (domain: string, options?: DomainsListDownstreamAddressesOptions): Promise<DomainsListDownstreamAddressesResponse> {
    const data: DomainsListDownstreamAddressesResponse = { records: [], error: null };

    if (!domain) {
      data.error = "No domain provided.";
      return data;
    }

    if (typeof options?.limit === "number" && options.limit < 1) {
      data.error = "The limit value is invalid. Only positive values are allowed.";
      return data;
    }

    if (typeof options?.offset === "number" && options.offset < 0) {
      data.error = "Offset must be greater than or equal to 0.";
      return data;
    }

    const response = await this.mailchannels.get<{ records: DomainsDownstreamAddress[] }>(`/inbound/v1/domains/${domain}/downstream-address`, {
      query: options,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch(() => null);

    if (!response) return data;
    data.records = response.records;
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
