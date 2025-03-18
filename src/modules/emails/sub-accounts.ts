import type { MailChannelsClient } from "../../client";
import type { SubAccountsListResponse, SubAccountsListOptions } from "../../types/emails/sub-accounts";

export class SubAccounts {
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Retrieves all sub-accounts associated with the parent account. The response is paginated with a default limit of 1000 sub-accounts per page and an offset of 0.
   * @example
   * ```ts
   * const mailchannels = new MailChannels("your-api-key");
   * const { accounts } = await mailchannels.emails.listSubAccounts()
   * ```
   */
  async listSubAccounts (options?: SubAccountsListOptions): Promise<SubAccountsListResponse> {
    const response = await this.mailchannels.get<SubAccountsListResponse["accounts"]>("/tx/v1/sub-account", {
      query: options
    });
    return {
      accounts: response
    };
  }
}
