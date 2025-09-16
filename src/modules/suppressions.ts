import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import type { SuccessResponse } from "../types";
import type { SuppressionsCreateOptions, SuppressionsListOptions, SuppressionsListResponse, SuppressionsSource } from "../types/suppressions";
import type { SuppressionsCreatePayload, SuppressionsListApiResponse, SuppressionsListPayload } from "../types/suppressions/internal";

export class Suppressions {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Creates suppression entries for the specified account. Parent accounts can create suppression entries for all associated sub-accounts. If `types` is not provided, it defaults to `non-transactional`. The operation is atomic, meaning all entries are successfully added or none are added if an error occurs.
   * @param options - The details of the suppression entries to create.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.suppressions.create({
   * // ...
   * });
   */
  async create (options: SuppressionsCreateOptions): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    const { addToSubAccounts, entries } = options;

    const payload: SuppressionsCreatePayload = {
      add_to_sub_accounts: addToSubAccounts,
      suppression_entries: entries.map(entry => ({
        notes: entry.notes,
        recipient: entry.recipient,
        suppression_types: Array.from(new Set(entry.types))
      }))
    };

    await this.mailchannels.post("/tx/v1/suppression-list", {
      body: payload,
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Conflict]: "Conflict. One or more suppression entries in the request already exist and cannot be created again.",
          [ErrorCode.PayloadTooLarge]: "Payload too large. The request exceeds the maximum allowed total of 1000 suppression entries for the parent account and/or its sub-accounts."
        });
      }
    });

    return data;
  }

  /**
   * Deletes suppression entry associated with the account based on the specified recipient and source.
   * @param recipient - The email address of the suppression entry to delete.
   * @param source - The source of the suppression entry to be deleted. If source is not provided, it defaults to `api`. If source is set to `all`, all suppression entries related to the specified recipient will be deleted.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.suppressions.delete('name@example.com', 'api');
   * ```
   */
  async delete (recipient: string, source?: SuppressionsSource): Promise<SuccessResponse> {
    const data: SuccessResponse = { success: false, error: null };

    await this.mailchannels.delete(`/tx/v1/suppression-list/recipients/${recipient}`, {
      query: {
        source
      },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    });

    return data;
  }

  /**
   * Retrieve suppression entries associated with the specified account. Supports filtering by recipient, source and creation date range. The response is paginated, with a default limit of `1000` entries per page and an offset of `0`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { list }= await mailchannels.suppressions.list();
   * ```
   * @param options - Options to filter and customize the suppression entries retrieval.
   */
  async list (options?: SuppressionsListOptions): Promise<SuppressionsListResponse> {
    const data: SuppressionsListResponse = { list: [], error: null };

    if (typeof options?.limit === "number" && (options.limit < 1 || options.limit > 1000)) {
      data.error = "The limit must be between 1 and 1000.";
      return data;
    }

    if (typeof options?.offset === "number" && options.offset < 0) {
      data.error = "Offset must be greater than or equal to 0.";
      return data;
    }

    const payload: SuppressionsListPayload = {
      recipient: options?.recipient,
      source: options?.source,
      created_before: options?.createdBefore,
      created_after: options?.createdAfter,
      limit: options?.limit,
      offset: options?.offset
    };

    const response = await this.mailchannels.get<SuppressionsListApiResponse>("/tx/v1/suppression-list", {
      query: payload,
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.list = response.suppression_list.map(entry => ({
      createdAt: entry.created_at,
      notes: entry.notes,
      recipient: entry.recipient,
      sender: entry.sender,
      source: entry.source,
      types: entry.suppression_types
    }));

    return data;
  }
}
