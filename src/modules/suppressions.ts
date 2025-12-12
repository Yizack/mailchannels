import type { MailChannelsClient } from "../client";
import { ErrorCode, getResultError, getStatusError } from "../utils/errors";
import { clean, validateLimit, validateOffset } from "../utils/helpers";
import type { SuccessResponse } from "../types/responses";
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
   * const { success, error } = await mailchannels.suppressions.create({
   * // ...
   * });
   */
  async create (options: SuppressionsCreateOptions): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    const { addToSubAccounts, entries } = options;

    const payload: SuppressionsCreatePayload = {
      add_to_sub_accounts: addToSubAccounts,
      suppression_entries: entries.map(entry => ({
        notes: entry.notes,
        recipient: entry.recipient,
        // Default to non-transactional when caller omits types
        suppression_types: Array.from(new Set(entry.types || ["non-transactional"]))
      }))
    };

    await this.mailchannels.post("/tx/v1/suppression-list", {
      body: payload,
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.Conflict]: "Conflict. One or more suppression entries in the request already exist and cannot be created again.",
          [ErrorCode.PayloadTooLarge]: "Payload too large. The request exceeds the maximum allowed total of 1000 suppression entries for the parent account and/or its sub-accounts."
        });
      }
    }).catch((error) => {
      result.error = getResultError(result, error, "Failed to create suppression entries.");
    });

    return result;
  }

  /**
   * Deletes suppression entry associated with the account based on the specified recipient and source.
   * @param recipient - The email address of the suppression entry to delete.
   * @param source - The source of the suppression entry to be deleted. If source is not provided, it defaults to `api`. If source is set to `all`, all suppression entries related to the specified recipient will be deleted.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.suppressions.delete('name@example.com', 'api');
   * ```
   */
  async delete (recipient: string, source?: SuppressionsSource): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    await this.mailchannels.delete(`/tx/v1/suppression-list/recipients/${recipient}`, {
      query: {
        source
      },
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      result.error = getResultError(result, error, "Failed to delete suppression entry.");
    });

    return result;
  }

  /**
   * Retrieve suppression entries associated with the specified account. Supports filtering by recipient, source and creation date range. The response is paginated, with a default limit of `1000` entries per page and an offset of `0`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.suppressions.list();
   * ```
   * @param options - Options to filter and customize the suppression entries retrieval.
   */
  async list (options?: SuppressionsListOptions): Promise<SuppressionsListResponse> {
    const result: SuppressionsListResponse = { data: null, error: null };

    result.error =
      validateLimit(options?.limit, 1000) ||
      validateOffset(options?.offset);

    if (result.error) return result;

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
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request."
        });
      }
    }).catch((error) => {
      result.error = getResultError(result, error, "Failed to fetch suppression entries.");
      return null;
    });

    if (!response) return result;

    result.data = clean(response.suppression_list.map(entry => ({
      createdAt: entry.created_at,
      notes: entry.notes,
      recipient: entry.recipient,
      sender: entry.sender,
      source: entry.source,
      types: entry.suppression_types
    })));

    return result;
  }
}
