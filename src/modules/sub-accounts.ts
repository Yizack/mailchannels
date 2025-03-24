import type { MailChannelsClient } from "../client";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "../types/sub-accounts/internal";
import type { SubAccountsAccount } from "../types/sub-accounts/create";
import type { SubAccountsListOptions } from "../types/sub-accounts/list";
import type { SubAccountsApiKey } from "../types/sub-accounts/api-key";
import type { SubAccountsSmtpPassword } from "../types/sub-accounts/smtp-password";
import { ErrorCode, getStatusError } from "../utils/errors";

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
  async create (handle?: string): Promise<{ account: SubAccountsAccount | null, error: string | null }> {
    const data: { account: SubAccountsAccount | null, error: string | null } = { account: null, error: null };

    if (handle) {
      const isValidHandle = SubAccounts.HANDLE_PATTERN.test(handle);
      if (!isValidHandle) {
        data.error = "Invalid handle. Sub-account handle must match the pattern [a-z0-9]{3,128}";
        return data;
      }
    }

    const response = await this.mailchannels.post<SubAccountsAccount>("/tx/v1/sub-account", {
      body: handle ? { handle } : undefined,
      onResponseError: ({ response }) => {
        data.error = getStatusError(response.status, {
          [ErrorCode.Forbidden]: "The parent account does not have permission to create sub-accounts.",
          [ErrorCode.Conflict]: `Sub-account with handle ${handle} already exists.`
        });
      }
    }).catch(() => null);

    data.account = response;
    return data;
  }

  /**
   * Retrieves all sub-accounts associated with the parent account. The response is paginated with a default limit of 1000 sub-accounts per page and an offset of 0.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { accounts } = await mailchannels.subAccounts.list()
   * ```
   */
  async list (options?: SubAccountsListOptions): Promise<{ accounts: SubAccountsAccount[], error: string | null }> {
    const data: { accounts: SubAccountsAccount[], error: string | null } = { accounts: [], error: null };

    if (options?.limit && (options.limit < 1 || options.limit > 1000)) {
      data.error = "The limit and/or offset query parameter are invalid.";
      return data;
    }

    const response = await this.mailchannels.get<SubAccountsAccount[]>("/tx/v1/sub-account", {
      query: options,
      onResponseError: async () => {
        data.error = "Unknown error.";
      }
    }).catch(() => []);

    data.accounts = response;
    return data;
  }

  /**
   * Deletes the sub-account identified by its handle.
   * @param handle - Handle of sub-account to be deleted.
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.subAccounts.delete('validhandle123')
   * ```
   */
  async delete (handle: string): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          data.error = "Unknown error.";
          return;
        }
        data.success = true;
      }
    });

    return data;
  }

  /**
   * Suspends the sub-account identified by its handle. This action disables the account, preventing it from sending any emails until it is reactivated.
   * @param handle - Handle of sub-account to be suspended.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.subAccounts.suspend('validhandle123')
   * ```
   */
  async suspend (handle: string): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

    await this.mailchannels.post<void>(`/tx/v1/sub-account/${handle}/suspend`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response.status, {
          [ErrorCode.NotFound]: `The specified sub-account ${handle} does not exist.`
        });
      }
    });

    return data;
  }

  /**
   * Activates a suspended sub-account identified by its handle, restoring its ability to send emails.
   * @param handle - Handle of sub-account to be activated.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success } = await mailchannels.subAccounts.activate('validhandle123')
   * ```
   */
  async activate (handle: string): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

    await this.mailchannels.post<void>(`/tx/v1/sub-account/${handle}/activate`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response.status, {
          [ErrorCode.Forbidden]: "The parent account does not have permission to activate the sub-account.",
          [ErrorCode.NotFound]: `The specified sub-account ${handle} does not exist.`
        });
      }
    });

    return data;
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
  async createApiKey (handle: string): Promise<{ key: SubAccountsApiKey | null, error: string | null }> {
    const data: { key: SubAccountsApiKey | null, error: string | null } = { key: null, error: null };

    const response = await this.mailchannels.post<{ id: number, key: string }>(`/tx/v1/sub-account/${handle}/api-key`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response.status, {
          [ErrorCode.Forbidden]: "You can't create API keys for this sub-account.",
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`,
          [ErrorCode.UnprocessableEntity]: "You have reached the limit of API keys you can create for this sub-account."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.key = {
      id: response.id,
      value: response.key
    };
    return data;
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
  async listApiKeys (handle: string): Promise<{ keys: SubAccountsApiKey[], error: string | null }> {
    const data: { keys: SubAccountsApiKey[], error: string | null } = { keys: [], error: null };

    const response = await this.mailchannels.get<{ id: number, key: string }[]>(`/tx/v1/sub-account/${handle}/api-key`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response.status, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch(() => []);

    data.keys = response.map(key => ({
      id: key.id,
      value: key.key
    }));
    return data;
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
  async deleteApiKey (handle: string, id: number): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/api-key/${id}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response.status, {
          [ErrorCode.BadRequest]: "Missing or invalid API key ID."
        });
      }
    });

    return data;
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
  async createSmtpPassword (handle: string): Promise<{ password: SubAccountsSmtpPassword | null, error: string | null }> {
    const data: { password: SubAccountsSmtpPassword | null, error: string | null } = { password: null, error: null };

    const response = await this.mailchannels.post<SubAccountsCreateSmtpPasswordApiResponse>(`/tx/v1/sub-account/${handle}/smtp-password`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response.status, {
          [ErrorCode.Forbidden]: "You can't create SMTP passwords for this sub-account.",
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`,
          [ErrorCode.UnprocessableEntity]: "You have reached the limit of SMTP passwords you can create for this sub-account."
        });
      }
    }).catch(() => null);

    if (!response) return data;

    data.password = {
      enabled: response.enabled,
      id: response.id,
      value: response.smtp_password
    };
    return data;
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
  async listSmtpPasswords (handle: string): Promise<{ passwords: SubAccountsSmtpPassword[], error: string | null }> {
    const data: { passwords: SubAccountsSmtpPassword[], error: string | null } = { passwords: [], error: null };

    const response = await this.mailchannels.get<SubAccountsCreateSmtpPasswordApiResponse[]>(`/tx/v1/sub-account/${handle}/smtp-password`, {
      onResponseError: async ({ response }) => {
        data.error = getStatusError(response.status, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch(() => []);

    data.passwords = response.map(password => ({
      enabled: password.enabled,
      id: password.id,
      value: password.smtp_password
    }));
    return data;
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
  async deleteSmtpPassword (handle: string, id: number): Promise<{ success: boolean, error: string | null }> {
    const data: { success: boolean, error: string | null } = { success: false, error: null };

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/smtp-password/${id}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          data.success = true;
          return;
        }
        data.error = getStatusError(response.status, {
          [ErrorCode.BadRequest]: "Missing or invalid SMTP password ID."
        });
      }
    });

    return data;
  }
}
