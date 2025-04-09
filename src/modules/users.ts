import type { MailChannelsClient } from "../client";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames, SuccessResponse } from "../types";
import type { UsersAddListEntryApiResponse, UsersCreateApiResponse } from "../types/users/internal";
import type { UsersCreateOptions, UsersCreateResponse } from "../types/users/create";
import { ErrorCode, getStatusError } from "../utils/errors";

export class Users {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Create a recipient user.
   * @param email - The email address of the user to create.
   * @param options - The options for the user to create.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { user } = await mailchannels.users.create("name@example.com", {
   *   admin: true
   * })
   * ```
   */
  async create (email: string, options?: UsersCreateOptions): Promise<UsersCreateResponse> {
    const { admin, filter, listEntries } = options || {};

    const data: UsersCreateResponse = { user: null, error: null };

    if (!email) {
      data.error = "No email address provided.";
      return data;
    }

    const response = await this.mailchannels.put<UsersCreateApiResponse>("/inbound/v1/users", {
      query: {
        email_address: email,
        admin: Boolean(admin),
        filter
      },
      body: {
        list_entries: listEntries
      },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: `The email address '${email}' is invalid.`
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.user = {
      email: response.recipient.email_address,
      roles: response.recipient.roles,
      filter: response.recipient.filter,
      listEntries: response.list_entries.map(({ item, item_type, action }) => ({
        item,
        type: item_type,
        action
      }))
    };

    return data;
  }

  /**
   * Add item to recipient user list
   * @param email - The email address of the recipient whose list will be modified.
   * @param options - The options for the list entry to add.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entry } = await mailchannels.users.addListEntry('name@example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async addListEntry (email: string, options: ListEntryOptions): Promise<ListEntryResponse> {
    const { listName, item } = options;

    const data: ListEntryResponse = { entry: null, error: null };

    if (!email) {
      data.error = "No email provided.";
      return data;
    }

    const response = await this.mailchannels.post<UsersAddListEntryApiResponse>(`/inbound/v1/users/${email}/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The recipient '${email}' was not found.`
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
   * Get recipient list entries.
   * @param email - The email address of the recipient whose list will be fetched.
   * @param listName - The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entries } = await mailchannels.users.listEntries('name@example.com', 'safelist')
   * ```
   */
  async listEntries (email: string, listName: ListNames) {
    const data: ListEntriesResponse = { entries: [], error: null };

    if (!email) {
      data.error = "No email provided.";
      return data;
    }

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    const response = await this.mailchannels.get<UsersAddListEntryApiResponse[]>(`/inbound/v1/users/${email}/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The recipient '${email}' was not found.`
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
   * Delete item from recipient list.
   * @param email - The email address of the recipient whose list will be modified.
   * @param options - The options for the list entry to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entry } = await mailchannels.users.deleteListEntry('name@example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async deleteListEntry (email: string, options: ListEntryOptions): Promise<SuccessResponse> {
    const { listName, item } = options;

    const data: SuccessResponse = { success: false, error: null };

    if (!email) {
      data.error = "No email provided.";
      return data;
    }

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    await this.mailchannels.delete(`/inbound/v1/users/${email}/lists/${listName}`, {
      query: { item },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The recipient '${email}' was not found.`
        });
      }
    });

    return data;
  }
}
