import type { MailChannelsClient } from "../client";
import { ErrorCode, createError, getResultError, getStatusError } from "../utils/errors";
import { clean } from "../utils/helpers";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames } from "../types/lists/entry";
import type { ListEntryApiResponse } from "../types/lists/internal";
import type { UsersCreateApiResponse } from "../types/users/internal";
import type { UsersCreateOptions, UsersCreateResponse } from "../types/users/create";

export class Users {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Create a recipient user.
   * @param email - The email address of the user to create.
   * @param options - The options for the user to create.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.users.create("name@example.com", {
   *   admin: true
   * })
   * ```
   */
  async create (email: string, options?: UsersCreateOptions): Promise<UsersCreateResponse> {
    const { admin, filter, listEntries } = options || {};

    let error: ErrorResponse | null = null;

    if (!email) {
      error = createError("No email address provided.");
      return { data: null, error };
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
        error = getStatusError(response, {
          [ErrorCode.BadRequest]: `The email address '${email}' is invalid.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to create user.");
      return null;
    });

    if (!response) return { data: null, error: error! };

    const data = clean({
      email: response.recipient.email_address,
      roles: response.recipient.roles,
      filter: response.recipient.filter,
      listEntries: response.list_entries.map(({ item, item_type, action }) => ({
        item,
        type: item_type,
        action
      }))
    });

    return { data, error: null };
  }

  /**
   * Add item to recipient user list
   * @param email - The email address of the recipient whose list will be modified.
   * @param options - The options for the list entry to add.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.users.addListEntry('name@example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async addListEntry (email: string, options: ListEntryOptions): Promise<ListEntryResponse> {
    const { listName, item } = options;

    let error: ErrorResponse | null = null;

    if (!email) {
      error = createError("No email provided.");
      return { data: null, error };
    }

    if (!listName) {
      error = createError("No list name provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.post<ListEntryApiResponse>(`/inbound/v1/users/${email}/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The recipient '${email}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to add user list entry.");
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
   * Get recipient list entries.
   * @param email - The email address of the recipient whose list will be fetched.
   * @param listName - The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.users.listEntries('name@example.com', 'safelist')
   * ```
   */
  async listEntries (email: string, listName: ListNames): Promise<ListEntriesResponse> {
    let error: ErrorResponse | null = null;

    if (!email) {
      error = createError("No email provided.");
      return { data: null, error };
    }

    if (!listName) {
      error = createError("No list name provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.get<ListEntryApiResponse[]>(`/inbound/v1/users/${email}/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The recipient '${email}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch user list entries.");
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
   * Delete item from recipient list.
   * @param email - The email address of the recipient whose list will be modified.
   * @param options - The options for the list entry to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.users.deleteListEntry('name@example.com', {
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async deleteListEntry (email: string, options: ListEntryOptions): Promise<SuccessResponse> {
    const { listName, item } = options;

    let error: ErrorResponse | null = null;

    if (!email) {
      error = createError("No email provided.");
      return { success: false, error };
    }

    if (!listName) {
      error = createError("No list name provided.");
      return { success: false, error };
    }

    await this.mailchannels.delete(`/inbound/v1/users/${email}/lists/${listName}`, {
      query: { item },
      onResponseError: async ({ response }) => {
        error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The domain is associated with an api key that is different than the one in the request, the domain is associated with a different customer, or the domain in the request is an alias domain.",
          [ErrorCode.NotFound]: `The recipient '${email}' was not found.`
        });
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to delete user list entry.");
    });

    return { success: !error, error };
  }
}
