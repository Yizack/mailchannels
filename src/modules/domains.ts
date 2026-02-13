import type { MailChannelsClient } from "../client";
import { ErrorCode, createError, getResultError, getStatusError, validatePagination } from "../utils/errors";
import { clean } from "../utils/helpers";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
import type { ListEntryApiResponse } from "../types/lists/internal";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames } from "../types/lists/entry";
import type { DomainsAddListEntryApiResponse } from "../types/domains/internal";
import type { DomainsBulkProvisionOptions, DomainsBulkProvisionResponse, DomainsData, DomainsProvisionOptions, DomainsProvisionResponse } from "../types/domains/provision";
import type { DomainsListOptions, DomainsListResponse } from "../types/domains/list";
import type { DomainsCreateLoginLinkResponse } from "../types/domains/create-login-link";
import type { DomainsDownstreamAddress, DomainsListDownstreamAddressesOptions, DomainsListDownstreamAddressesResponse } from "../types/domains/downstream-addresses";
import type { DomainsBulkCreateLoginLinks, DomainsBulkCreateLoginLinksResponse } from "../types/domains/bulk-create-login-links";

export class Domains {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Provision a single domain to use MailChannels Inbound.
   * @param options - The provision options and domain data.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.provision({
   *   domain: 'example.com',
   *   subscriptionHandle: 'your-subscription-handle'
   * })
   * ```
   */
  async provision (options: DomainsProvisionOptions): Promise<DomainsProvisionResponse> {
    let error: ErrorResponse | null = null;

    const { associateKey, overwrite, ...payload } = options;

    const response = await this.mailchannels.post<DomainsProvisionResponse["data"]>("/inbound/v1/domains", {
      query: {
        "associate-key": associateKey,
        "overwrite": overwrite
      },
      body: payload,
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request, returned in the case that an error occurs while converting an A-label domain to a U-label domain name.",
          [ErrorCode.Forbidden]: "The limit on associated domains is reached or you are attempting to associate a domain with a subscription that is not your own.",
          [ErrorCode.Conflict]: `The domain '${options.domain}' is already provisioned, and is associated with a different customer.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to provision domain.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response);

    return { data, error: null };
  }

  /**
   * Provision up to 1000 domains to use MailChannels Inbound.
   * @param options - The options to provision the domains.
   * @param domains - A list of domain data to provision.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.bulkProvision({
   *   subscriptionHandle: 'your-subscription-handle'
   * }, [
   *   {
   *     domain: 'example.com',
   *     admins: ['support@example.com']
   *   },
   *   {
   *     domain: 'example2.com'
   *   }
   * ])
   * ```
   */
  async bulkProvision (options: DomainsBulkProvisionOptions, domains: Omit<DomainsData, "subscriptionHandle">[]): Promise<DomainsBulkProvisionResponse> {
    let error: ErrorResponse | null = null;

    const { associateKey, overwrite, subscriptionHandle } = options;

    if (!domains || !domains.length) {
      error = createError("No domains provided.");
      return { data: null, error };
    }

    if (domains.length > 1000) {
      error = createError("The maximum number of domains to be provisioned is 1000.");
      return { data: null, error };
    }

    const response = await this.mailchannels.post<DomainsBulkProvisionResponse["data"]>("/inbound/v1/domains/batch", {
      query: {
        subscriptionHandle,
        "associate-key": associateKey,
        "overwrite": overwrite
      },
      body: { domains },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request, returned in the case that a domain name fails RFC 5891 validation.",
          [ErrorCode.Forbidden]: "The limit on associated domains is reached or you are attempting to associate a domain with a subscription that is not your own."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to provision domains.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response);

    return { data, error: null };
  }

  /**
   * Fetch a list of all domains associated with this API key.
   * @param options - The options to filter the list of domains.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.list()
   * ```
   */
  async list (options?: DomainsListOptions): Promise<DomainsListResponse> {
    let error: ErrorResponse | null = null;

    error = validatePagination({ ...options, max: 5000 });
    if (error) return { data: null, error };

    const response = await this.mailchannels.get<{ domains: DomainsData[], total: number }>("/inbound/v1/domains", {
      query: options,
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch domains.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      domains: response.domains,
      total: response.total
    });

    return { data, error: null };
  }

  /**
   * De-provision a domain to cease protecting it with MailChannels Inbound.
   * @param domain - The domain name to be removed.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.domains.delete('example.com')
   * ```
   */
  async delete (domain: string): Promise<SuccessResponse> {
    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { success: false, error };
    }

    await this.mailchannels.delete<void>(`/inbound/v1/domains/${domain}`, {
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to delete domain.");
    });

    return { success: !error, error };
  }

  /**
   * Add an entry to a domain blocklist or safelist.
   * @param domain - The domain name.
   * @param options - The options to add a list entry.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.addListEntry('example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async addListEntry (domain: string, options: ListEntryOptions): Promise<ListEntryResponse> {
    const { listName, item } = options;

    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { data: null, error };
    }

    if (!listName) {
      error = createError("No list name provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.post<DomainsAddListEntryApiResponse>(`/inbound/v1/domains/${domain}/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to add domain list entry.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      action: response.action,
      item: response.item,
      type: response.item_type
    });

    return { data, error: null };
  }

  /**
   * Get domain list entries.
   * @param domain - The domain name.
   * @param listName - The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.listEntries('example.com', 'safelist')
   * ```
   */
  async listEntries (domain: string, listName: ListNames): Promise<ListEntriesResponse> {
    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { data: null, error };
    }

    if (!listName) {
      error = createError("No list name provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.get<ListEntryApiResponse[]>(`/inbound/v1/domains/${domain}/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch domain list entries.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response.map(({ action, item, item_type }) => ({
      action,
      item,
      type: item_type
    })));

    return { data, error: null };
  }

  /**
   * Delete item from domain list.
   * @param email - The domain name whose list will be modified.
   * @param options - The options for the list entry to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.domains.deleteListEntry('example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async deleteListEntry (domain: string, options: ListEntryOptions): Promise<SuccessResponse> {
    const { listName, item } = options;

    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { success: false, error };
    }

    if (!listName) {
      error = createError("No list name provided.");
      return { success: false, error };
    }

    await this.mailchannels.delete(`/inbound/v1/domains/${domain}/lists/${listName}`, {
      query: { item },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to delete domain list entry.");
    });

    return { success: !error, error };
  }

  /**
   * Generate a link that allows a user to log in as a domain administrator.
   * @param domain - The domain name.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.createLoginLink('example.com')
   * ```
   */
  async createLoginLink (domain: string): Promise<DomainsCreateLoginLinkResponse> {
    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.get<{ loginLink: string }>(`/inbound/v1/domains/${domain}/login-link`, {
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Unauthorized]: "The domain does not belong to this customer.",
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to create login link.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      link: response.loginLink
    });

    return { data, error: null };
  }

  /**
   * Sets the list of downstream addresses for the domain. This action deletes any existing downstream address for the domain before creating new ones. If the `records` parameter is an empty array, all downstream address records will be deleted.
   * @param domain - The domain name.
   * @param records - The list of records to set for the domain. A maximum of 10 records can be set.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.domains.setDownstreamAddress('example.com', [
   *   {
   *     port: 25,
   *     priority: 10,
   *     target: 'example.com.',
   *     weight: 10
   *   }
   * ])
   * ```
   */
  async setDownstreamAddress (domain: string, records: DomainsDownstreamAddress[]): Promise<SuccessResponse> {
    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { success: false, error };
    }

    if (!records) {
      error = createError("No records provided.");
      return { success: false, error };
    }

    if (records.length > 10) {
      error = createError("The maximum of records to be set is 10.");
      return { success: false, error };
    }

    await this.mailchannels.put<void>(`/inbound/v1/domains/${domain}/downstream-address`, {
      body: { records },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to set downstream address.");
    });

    return { success: !error, error };
  }

  /**
   * Retrieve stored downstream addresses for the domain.
   * @param domain - The domain name.
   * @param options - The options to filter the list of downstream addresses.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.listDownstreamAddresses('example.com')
   * ```
   */
  async listDownstreamAddresses (domain: string, options?: DomainsListDownstreamAddressesOptions): Promise<DomainsListDownstreamAddressesResponse> {
    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { data: null, error };
    }

    error = validatePagination(options);
    if (error) return { data: null, error };

    const response = await this.mailchannels.get<{ records: DomainsDownstreamAddress[] }>(`/inbound/v1/domains/${domain}/downstream-address`, {
      query: options,
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The domain '${domain}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to list downstream addresses.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response.records);

    return { data, error: null };
  }

  /**
   * Update the API key that is associated with a domain.
   * @param domain - The domain name.
   * @param key - The new API key to associate with this domain.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.domains.updateApiKey('example.com', 'your-api-key')
   * ```
   */
  async updateApiKey (domain: string, key: string): Promise<SuccessResponse> {
    let error: ErrorResponse | null = null;

    if (!domain) {
      error = createError("No domain provided.");
      return { success: false, error };
    }

    if (!key) {
      error = createError("No API key provided.");
      return { success: false, error };
    }

    await this.mailchannels.put<void>(`/inbound/v1/domains/${domain}/api-key`, {
      body: { apiKey: key },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: "The domain does not exist."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to update domain API key.");
    });

    return { success: !error, error };
  }

  /**
   * Generate a batch of links that allow a user to log in as a domain administrator to their different domains.
   * @param domains - The list of domain names. Maximum of `1000` links per request.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.domains.bulkCreateLoginLinks(['example.com', 'example2.com'])
   * ```
   */
  async bulkCreateLoginLinks (domains: string[]): Promise<DomainsBulkCreateLoginLinksResponse> {
    let error: ErrorResponse | null = null;

    if (!domains || !domains.length) {
      error = createError("No domains provided.");
      return { data: null, error };
    }

    if (domains.length > 1000) {
      error = createError("The maximum number of domains to create login links for is 1000.");
      return { data: null, error };
    }

    const response = await this.mailchannels.post<DomainsBulkCreateLoginLinks>("/inbound/v1/domains/batch/login-link", {
      body: {
        domains: domains.map(domain => ({ domain }))
      },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to create login links.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean(response);

    return { data, error: null };
  }
}
