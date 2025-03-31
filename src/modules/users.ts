import type { MailChannelsClient } from "../client";
import type { SuccessResponse } from "../types/success-response";
import type { UsersCreateApiResponse } from "../types/users/internal";
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
   */
  async create (email: string, options?: UsersCreateOptions): Promise<UsersCreateResponse> {
    const data: UsersCreateResponse = { user: null, error: null };

    if (!email) {
      data.error = "No email address provided.";
      return data;
    }

    const response = await this.mailchannels.put<UsersCreateApiResponse>("/inbound/v1/users", {
      query: {
        email_address: email,
        admin: Boolean(options?.admin),
        filter: options?.filter
      },
      body: {
        list_entries: options?.listEntries
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
}
