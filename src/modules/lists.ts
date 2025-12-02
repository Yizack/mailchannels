import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/responses";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames } from "../types/lists/entry";
import type { ListEntryApiResponse } from "../types/lists/internal";
import { getStatusError } from "../utils/errors";

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
    const { listName, item } = options;

    const result: ListEntryResponse = { data: null, error: null };

    if (!listName) {
      result.error = "No list name provided.";
      return result;
    }

    const response = await this.mailchannels.post<ListEntryApiResponse>(`/inbound/v1/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response);
      }
    }).catch(() => null);

    if (!response) return result;

    result.data = {
      action: response.action,
      item: response.item,
      type: response.item_type
    };
    return result;
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
    const result: ListEntriesResponse = { data: null, error: null };

    if (!listName) {
      result.error = "No list name provided.";
      return result;
    }

    const response = await this.mailchannels.get<ListEntryApiResponse[]>(`/inbound/v1/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response);
      }
    }).catch(() => null);

    if (!response) return result;

    result.data = response.map(({ action, item, item_type }) => ({
      action,
      item,
      type: item_type
    }));
    return result;
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

    const result: SuccessResponse = { success: false, error: null };

    if (!listName) {
      result.error = "No list name provided.";
      return result;
    }

    await this.mailchannels.delete(`/inbound/v1/lists/${listName}`, {
      query: { item },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response);
      }
    });

    return result;
  }
}
