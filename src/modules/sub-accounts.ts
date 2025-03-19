import type { MailChannelsClient } from "../client";
import type { SubAccountsListResponse, SubAccountsListOptions } from "../types/sub-accounts/list";

export class SubAccounts {
  private static readonly HANDLE_PATTERN = /^[a-z0-9]{3,128}$/;
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Creates a new sub-account under the parent account. Each sub-account must have a unique handle composed solely of lowercase alphanumeric characters. If no handle is provided, a random handle will be generated.
   * @param handle - The handle of the sub-account to create. Sub-account handle must match the pattern `[a-z0-9]{3,128}`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { account } = await mailchannels.subAccounts.create("validhandle123");
   * ```
   */
  async create (handle?: string): Promise<{ account: { enabled: boolean, handle: string } }> {
    if (handle) {
      const isValidHandle = SubAccounts.HANDLE_PATTERN.test(handle);
      if (!isValidHandle) {
        throw new Error("Invalid handle. Sub-account handle must match the pattern [a-z0-9]{3,128}");
      }
    }

    const response = await this.mailchannels.post<{ enabled: boolean, handle: string }>("/tx/v1/sub-account", {
      body: handle ? { handle } : undefined
    });

    return {
      account: response
    };
  }

  /**
   * Retrieves all sub-accounts associated with the parent account. The response is paginated with a default limit of 1000 sub-accounts per page and an offset of 0.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { accounts } = await mailchannels.subAccounts.list()
   * ```
   */
  async list (options?: SubAccountsListOptions): Promise<SubAccountsListResponse> {
    const response = await this.mailchannels.get<SubAccountsListResponse["accounts"]>("/tx/v1/sub-account", {
      query: options
    });

    return {
      accounts: response
    };
  }
}
