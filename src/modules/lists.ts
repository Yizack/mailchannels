import type { MailChannelsClient } from "../client";
import { createError, getResultError, getStatusError } from "../utils/errors";
import { clean } from "../utils/helpers";
import type { ErrorResponse, SuccessResponse } from "../types/responses";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames } from "../types/lists/entry";
import type { ListEntryApiResponse } from "../types/lists/internal";

export class Lists {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Add item to account-level list
   * @param options - The options for the list entry to add.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.lists.addListEntry({
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async addListEntry (options: ListEntryOptions): Promise<ListEntryResponse> {
    let error: ErrorResponse | null = null;

    const { listName, item } = options;

    if (!listName) {
      error = createError("No list name provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.post<ListEntryApiResponse>(`/inbound/v1/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to add list entry.");
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
   * Get account-level list entries.
   * @param listName - The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.lists.listEntries('safelist')
   * ```
   */
  async listEntries (listName: ListNames): Promise<ListEntriesResponse> {
    let error: ErrorResponse | null = null;

    if (!listName) {
      error = createError("No list name provided.");
      return { data: null, error };
    }

    const response = await this.mailchannels.get<ListEntryApiResponse[]>(`/inbound/v1/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to fetch list entries.");
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
   * Delete item from account-level list.
   * @param options - The options for the list entry to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.lists.deleteListEntry({
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async deleteListEntry (options: ListEntryOptions): Promise<SuccessResponse> {
    const { listName, item } = options;

    let error: ErrorResponse | null = null;

    if (!listName) {
      error = createError("No list name provided.");
      return { success: false, error };
    }

    await this.mailchannels.delete(`/inbound/v1/lists/${listName}`, {
      query: { item },
      onResponseError: async ({ response }) => {
        error = getStatusError(response);
      }
    }).catch((e) => {
      error ||= getResultError(e, "Failed to delete list entry.");
    });

    return { success: !error, error };
  }
}
