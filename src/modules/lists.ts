import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/success-response";
import type { ListEntriesResponse, ListEntryOptions, ListEntryResponse, ListNames } from "../types/list-entry";
import type { ListEntryApiResponse } from "../types/internal";
import { getStatusError } from "../utils/errors";

export class Lists {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Add item to account-level list
   * @param options - The options for the list entry to add.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entry } = await mailchannels.lists.addListEntry({
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async addListEntry (options: ListEntryOptions): Promise<ListEntryResponse> {
    const { listName, item } = options;

    const data: ListEntryResponse = { entry: null, error: null };

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    const response = await this.mailchannels.post<ListEntryApiResponse>(`/inbound/v1/lists/${listName}`, {
      body: { item },
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response);
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
   * Get account-level list entries.
   * @param listName - The name of the list to fetch. This can be a `blocklist`, `safelist`, `blacklist`, or `whitelist`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { entries } = await mailchannels.lists.listEntries('safelist')
   * ```
   */
  async listEntries (listName: ListNames): Promise<ListEntriesResponse> {
    const data: ListEntriesResponse = { entries: [], error: null };

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    const response = await this.mailchannels.get<ListEntryApiResponse[]>(`/inbound/v1/lists/${listName}`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response);
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
   * Delete item from account-level list.
   * @param options - The options for the list entry to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.lists.deleteListEntry({
   *   listName: 'safelist',
   *   item: 'name@domain.com'
   * })
   * ```
   */
  async deleteListEntry (options: ListEntryOptions): Promise<SuccessResponse> {
    const { listName, item } = options;

    const data: SuccessResponse = { success: false, error: null };

    if (!listName) {
      data.error = "No list name provided.";
      return data;
    }

    await this.mailchannels.delete(`/inbound/v1/lists/${listName}`, {
      query: { item },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response);
      }
    });

    return data;
  }
}
