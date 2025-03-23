import type { MailChannelsClient } from "../client";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "../types/sub-accounts/internal";
import type { SubAccountsAccount } from "../types/sub-accounts/create";
import type { SubAccountsListOptions } from "../types/sub-accounts/list";
import type { SubAccountsApiKey } from "../types/sub-accounts/api-key";
import type { SubAccountsSmtpPassword } from "../types/sub-accounts/smtp-password";
import { ErrorCode } from "../utils/errors";
import { Logger } from "../utils/logger";

export class SubAccounts {
  private static readonly HANDLE_PATTERN = /^[a-z0-9]{3,128}$/;
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Creates a new sub-account under the parent account. Each sub-account must have a unique handle composed solely of lowercase alphanumeric characters. If no handle is provided, a random handle will be generated.
   * @param handle - The handle of the sub-account to create. Sub-account handle must match the pattern `[a-z0-9]{3,128}`.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { account } = await mailchannels.subAccounts.create('validhandle123')
   * ```
   */
  async create (handle?: string): Promise<{ account?: SubAccountsAccount }> {
    if (handle) {
      const isValidHandle = SubAccounts.HANDLE_PATTERN.test(handle);
      if (!isValidHandle) {
        Logger.error("Invalid handle. Sub-account handle must match the pattern [a-z0-9]{3,128}");
        return { account: undefined };
      }
    }

    const response = await this.mailchannels.post<SubAccountsAccount>("/tx/v1/sub-account", {
      body: handle ? { handle } : undefined,
      onResponseError: ({ response }) => {
        switch (response.status) {
          case ErrorCode.Forbidden:
            return Logger.error("The parent account does not have permission to create sub-accounts.");
          case ErrorCode.Conflict:
            return Logger.error(`Sub-account with handle ${handle} already exists.`);
        }
      }
    }).catch(() => undefined);

    return {
      account: response
    };
  }

  /**
   * Retrieves all sub-accounts associated with the parent account. The response is paginated with a default limit of 1000 sub-accounts per page and an offset of 0.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { accounts } = await mailchannels.subAccounts.list()
   * ```
   */
  async list (options?: SubAccountsListOptions): Promise<{ accounts: SubAccountsAccount[] }> {
    if (options?.limit && (options.limit < 1 || options.limit > 1000)) {
      Logger.error("The limit and/or offset query parameter are invalid.");
      return { accounts: [] };
    }

    const response = await this.mailchannels.get<SubAccountsAccount[]>("/tx/v1/sub-account", {
      query: options,
      onResponseError: async () => {
        Logger.error("Unknown error.");
      }
    }).catch(() => []);

    return {
      accounts: response
    };
  }

  /**
   * Deletes the sub-account identified by its handle.
   * @param handle - Handle of sub-account to be deleted.
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.subAccounts.delete('validhandle123')
   * ```
   */
  async delete (handle: string): Promise<{ success: boolean }> {
    let success = false;

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          return Logger.error("Unknown error.");
        }
        success = true;
      }
    });

    return { success };
  }

  /**
   * Creates a new API key for the specified sub-account.
   * @param handle - Handle of the sub-account to create API key for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { key } = await mailchannels.subAccounts.createApiKey('validhandle123')
   * ```
   */
  async createApiKey (handle: string): Promise<{ key?: SubAccountsApiKey }> {
    const response = await this.mailchannels.post<{ id: number, key: string }>(`/tx/v1/sub-account/${handle}/api-key`, {
      onResponseError: async ({ response }) => {
        switch (response.status) {
          case ErrorCode.Forbidden:
            return Logger.error("You can't create API keys for this sub-account.");
          case ErrorCode.NotFound:
            return Logger.error(`Sub-account with handle '${handle}' not found.`);
          case ErrorCode.UnprocessableEntity:
            return Logger.error("You have reached the limit of API keys you can create for this sub-account.");
          default:
            return Logger.error("Unknown error.");
        }
      }
    }).catch(() => undefined);

    if (!response) return { key: undefined };

    return {
      key: {
        id: response.id,
        value: response.key
      }
    };
  }

  /**
   * Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.
   * @param handle - Handle of the sub-account to retrieve the API key for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { keys } = await mailchannels.subAccounts.listApiKeys('validhandle123')
   * ```
   */
  async listApiKeys (handle: string): Promise<{ keys: SubAccountsApiKey[] }> {
    const response = await this.mailchannels.get<{ id: number, key: string }[]>(`/tx/v1/sub-account/${handle}/api-key`, {
      onResponseError: async ({ response }) => {
        switch (response.status) {
          case ErrorCode.NotFound:
            return Logger.error(`Sub-account with handle '${handle}' not found.`);
          default:
            return Logger.error("Unknown error.");
        }
      }
    }).catch(() => []);

    return {
      keys: response.map(key => ({
        id: key.id,
        value: key.key
      }))
    };
  }

  /**
   * Deletes the API key identified by its ID for the specified sub-account.
   * @param handle - Handle of the sub-account for which the API key should be deleted.
   * @param id - The ID of the API key to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.subAccounts.deleteApiKey('validhandle123', 1)
   * ```
   */
  async deleteApiKey (handle: string, id: number): Promise<{ success: boolean }> {
    let success = false;

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/api-key/${id}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          success = true;
          return;
        }
        switch (response.status) {
          case ErrorCode.BadRequest:
            return Logger.error("Missing or invalid API key ID.");
          default:
            return Logger.error("Unknown error.");
        }
      }
    });

    return { success };
  }

  /**
   * Creates a new SMTP password for the specified sub-account.
   * @param handle - Handle of the sub-account to create SMTP password for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { password } = await mailchannels.subAccounts.createSmtpPassword('validhandle123')
   * ```
   */
  async createSmtpPassword (handle: string): Promise<{ password?: SubAccountsSmtpPassword }> {
    const response = await this.mailchannels.post<SubAccountsCreateSmtpPasswordApiResponse>(`/tx/v1/sub-account/${handle}/smtp-password`, {
      onResponseError: async ({ response }) => {
        switch (response.status) {
          case ErrorCode.Forbidden:
            return Logger.error("You can't create SMTP passwords for this sub-account.");
          case ErrorCode.NotFound:
            return Logger.error(`Sub-account with handle '${handle}' not found.`);
          case ErrorCode.UnprocessableEntity:
            return Logger.error("You have reached the limit of SMTP passwords you can create for this sub-account.");
          default:
            return Logger.error("Unknown error.");
        }
      }
    }).catch(() => undefined);

    if (!response) return { password: undefined };

    return {
      password: {
        enabled: response.enabled,
        id: response.id,
        value: response.smtp_password
      }
    };
  }

  /**
   * Retrieves details of all SMTP passwords associated with the specified sub-account. For security, the full SMTP password is not returned; only the password ID and a partially redacted version are provided.
   * @param handle - Handle of the sub-account to retrieve the SMTP password for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { passwords } = await mailchannels.subAccounts.listSmtpPasswords('validhandle123')
   * ```
   */
  async listSmtpPasswords (handle: string): Promise<{ passwords: SubAccountsSmtpPassword[] }> {
    const response = await this.mailchannels.get<SubAccountsCreateSmtpPasswordApiResponse[]>(`/tx/v1/sub-account/${handle}/smtp-password`, {
      onResponseError: async ({ response }) => {
        switch (response.status) {
          case ErrorCode.NotFound:
            return Logger.error(`Sub-account with handle '${handle}' not found.`);
          default:
            return Logger.error("Unknown error.");
        }
      }
    }).catch(() => []);

    return {
      passwords: response.map(password => ({
        enabled: password.enabled,
        id: password.id,
        value: password.smtp_password
      }))
    };
  }

  /**
   * Deletes the SMTP password identified by its ID for the specified sub-account.
   * @param handle - Handle of the sub-account for which the SMTP password should be deleted.
   * @param id - The ID of the SMTP password to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.subAccounts.deleteSmtpPassword('validhandle123', 1)
   * ```
   */
  async deleteSmtpPassword (handle: string, id: number): Promise<{ success: boolean }> {
    let success = false;

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/smtp-password/${id}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          success = true;
          return;
        }
        switch (response.status) {
          case ErrorCode.BadRequest:
            return Logger.error("Missing or invalid SMTP password ID.");
          default:
            return Logger.error("Unknown error.");
        }
      }
    });

    return { success };
  }
}
