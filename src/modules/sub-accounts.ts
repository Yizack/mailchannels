import type { MailChannelsClient } from "../client";
import { ErrorCode, getStatusError } from "../utils/errors";
import { clean, validateLimit, validateOffset } from "../utils/helpers";
import type { SuccessResponse } from "../types/responses";
import type { SubAccountsCreateApiResponse, SubAccountsCreateSmtpPasswordApiResponse, SubAccountsListApiResponse, SubAccountsUsageApiResponse } from "../types/sub-accounts/internal";
import type { SubAccountsCreateResponse } from "../types/sub-accounts/create";
import type { SubAccountsListOptions, SubAccountsListResponse } from "../types/sub-accounts/list";
import type { SubAccountsCreateApiKeyResponse, SubAccountsListApiKeyOptions, SubAccountsListApiKeyResponse } from "../types/sub-accounts/api-key";
import type { SubAccountsCreateSmtpPasswordResponse, SubAccountsListSmtpPasswordResponse } from "../types/sub-accounts/smtp-password";
import type { SubAccountsLimit, SubAccountsLimitResponse } from "../types/sub-accounts/limit";
import type { SubAccountsUsageResponse } from "../types/sub-accounts/usage";

export class SubAccounts {
  private static readonly COMPANY_PATTERN = /^.{3,128}$/;
  private static readonly HANDLE_PATTERN = /^[a-z0-9]{3,128}$/;
  constructor (protected mailchannels: MailChannelsClient) {}

  /**
   * Creates a new sub-account under the parent account. Each sub-account must have a unique handle composed solely of lowercase alphanumeric characters. If no handle is provided, a random handle will be generated. Note that Sub-accounts are only available to parent accounts on 100K and higher plans.
   * @param companyName - The name of the company associated with the sub-account. This name is used for display purposes only and does not affect the functionality of the sub-account. The length must be between 3 and 128 characters.
   * @param handle - A unique name for the sub-account to be created. The length must be between 3 and 128 characters, and it may contain only lowercase letters and numbers. If not provided, a random handle will be generated.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.create('My Company', 'validhandle123')
   * ```
   */
  async create (companyName: string, handle?: string): Promise<SubAccountsCreateResponse> {
    const result: SubAccountsCreateResponse = { data: null, error: null };

    const isValidCompany = SubAccounts.COMPANY_PATTERN.test(companyName);
    if (!isValidCompany) {
      result.error = "Invalid company name. Company name must be between 3 and 128 characters.";
      return result;
    }

    if (handle) {
      const isValidHandle = SubAccounts.HANDLE_PATTERN.test(handle);
      if (!isValidHandle) {
        result.error = "Invalid handle. Sub-account handle must be between 3 and 128 characters and contain only lowercase letters and numbers.";
        return result;
      }
    }

    const response = await this.mailchannels.post<SubAccountsCreateApiResponse>("/tx/v1/sub-account", {
      body: {
        company_name: companyName,
        handle
      },
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The parent account does not have permission to create sub-accounts.",
          [ErrorCode.Conflict]: `Sub-account with handle '${handle}' already exists.`
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to create sub-account.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      companyName: response.company_name,
      enabled: response.enabled,
      handle: response.handle
    });

    return result;
  }

  /**
   * Retrieves all sub-accounts associated with the parent account. The response is paginated with a default limit of 1000 sub-accounts per page and an offset of 0.
   * @param options - The options to filter the list of sub-accounts.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.list()
   * ```
   */
  async list (options?: SubAccountsListOptions): Promise<SubAccountsListResponse> {
    const result: SubAccountsListResponse = { data: null, error: null };

    result.error =
      validateLimit(options?.limit, 1000) ||
      validateOffset(options?.offset);

    if (result.error) return result;

    const response = await this.mailchannels.get<SubAccountsListApiResponse>("/tx/v1/sub-account", {
      query: options,
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response);
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch sub-accounts.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean(response.map(account => ({
      companyName: account.company_name,
      enabled: account.enabled,
      handle: account.handle
    })));

    return result;
  }

  /**
   * Deletes the sub-account identified by its handle.
   * @param handle - Handle of sub-account to be deleted.
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.delete('validhandle123')
   * ```
   */
  async delete (handle: string): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (!response.ok) {
          result.error = getStatusError(response);
          return;
        }
        result.success = true;
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to delete sub-account.";
    });

    return result;
  }

  /**
   * Suspends the sub-account identified by its handle. This action disables the account, preventing it from sending any emails until it is reactivated.
   * @param handle - Handle of sub-account to be suspended.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.suspend('validhandle123')
   * ```
   */
  async suspend (handle: string): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.post<void>(`/tx/v1/sub-account/${handle}/suspend`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: `The specified sub-account '${handle}' does not exist.`
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to suspend sub-account.";
    });

    return result;
  }

  /**
   * Activates a suspended sub-account identified by its handle, restoring its ability to send emails.
   * @param handle - Handle of sub-account to be activated.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.activate('validhandle123')
   * ```
   */
  async activate (handle: string): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.post<void>(`/tx/v1/sub-account/${handle}/activate`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "The parent account does not have permission to activate the sub-account.",
          [ErrorCode.NotFound]: `The specified sub-account '${handle}' does not exist.`
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to activate sub-account.";
    });

    return result;
  }

  /**
   * Creates a new API key for the specified sub-account.
   * @param handle - Handle of the sub-account to create API key for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.createApiKey('validhandle123')
   * ```
   */
  async createApiKey (handle: string): Promise<SubAccountsCreateApiKeyResponse> {
    const result: SubAccountsCreateApiKeyResponse = { data: null, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    const response = await this.mailchannels.post<{ id: number, key: string }>(`/tx/v1/sub-account/${handle}/api-key`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "You can't create API keys for this sub-account.",
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`,
          [ErrorCode.UnprocessableEntity]: "You have reached the limit of API keys you can create for this sub-account."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to create sub-account API key.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      id: response.id,
      value: response.key
    });

    return result;
  }

  /**
   * Retrieves details of all API keys associated with the specified sub-account. For security reasons, the full API key is not returned; only the key ID and a partially redacted version are provided.
   * @param handle - Handle of the sub-account to retrieve the API key for.
   * @param options - The options to filter the list of API keys.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.listApiKeys('validhandle123')
   * ```
   */
  async listApiKeys (handle: string, options?: SubAccountsListApiKeyOptions): Promise<SubAccountsListApiKeyResponse> {
    const result: SubAccountsListApiKeyResponse = { data: null, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    result.error =
      validateLimit(options?.limit, 1000) ||
      validateOffset(options?.offset);

    if (result.error) return result;

    const response = await this.mailchannels.get<{ id: number, key: string }[]>(`/tx/v1/sub-account/${handle}/api-key`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch sub-account API keys.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean(response.map(key => ({
      id: key.id,
      value: key.key
    })));

    return result;
  }

  /**
   * Deletes the API key identified by its ID for the specified sub-account.
   * @param handle - Handle of the sub-account for which the API key should be deleted.
   * @param id - The ID of the API key to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.deleteApiKey('validhandle123', 1)
   * ```
   */
  async deleteApiKey (handle: string, id: number): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/api-key/${id}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Missing or invalid API key ID."
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to delete sub-account API key.";
    });

    return result;
  }

  /**
   * Creates a new SMTP password for the specified sub-account.
   * @param handle - Handle of the sub-account to create SMTP password for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.createSmtpPassword('validhandle123')
   * ```
   */
  async createSmtpPassword (handle: string): Promise<SubAccountsCreateSmtpPasswordResponse> {
    const result: SubAccountsCreateSmtpPasswordResponse = { data: null, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    const response = await this.mailchannels.post<SubAccountsCreateSmtpPasswordApiResponse>(`/tx/v1/sub-account/${handle}/smtp-password`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.Forbidden]: "You can't create SMTP passwords for this sub-account.",
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`,
          [ErrorCode.UnprocessableEntity]: "You have reached the limit of SMTP passwords you can create for this sub-account."
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to create sub-account SMTP password.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      enabled: response.enabled,
      id: response.id,
      value: response.smtp_password
    });

    return result;
  }

  /**
   * Retrieves details of all SMTP passwords associated with the specified sub-account. For security, the full SMTP password is not returned; only the password ID and a partially redacted version are provided.
   * @param handle - Handle of the sub-account to retrieve the SMTP password for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.listSmtpPasswords('validhandle123')
   * ```
   */
  async listSmtpPasswords (handle: string): Promise<SubAccountsListSmtpPasswordResponse> {
    const result: SubAccountsListSmtpPasswordResponse = { data: null, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    const response = await this.mailchannels.get<SubAccountsCreateSmtpPasswordApiResponse[]>(`/tx/v1/sub-account/${handle}/smtp-password`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch sub-account SMTP passwords.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean(response.map(password => ({
      enabled: password.enabled,
      id: password.id,
      value: password.smtp_password
    })));

    return result;
  }

  /**
   * Deletes the SMTP password identified by its ID for the specified sub-account.
   * @param handle - Handle of the sub-account for which the SMTP password should be deleted.
   * @param id - The ID of the SMTP password to delete.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.deleteSmtpPassword('validhandle123', 1)
   * ```
   */
  async deleteSmtpPassword (handle: string, id: number): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/smtp-password/${id}`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Missing or invalid SMTP password ID."
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to delete sub-account SMTP password.";
    });

    return result;
  }

  /**
   * Retrieves the limit of a specified sub-account. A value of `-1` indicates that the sub-account inherits the parent account's limit, allowing the sub-account to utilize any remaining capacity within the parent account's allocation.
   * @param handle - Handle of the sub-account to retrieve the limit for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.getLimit('validhandle123')
   * ```
   */
  async getLimit (handle: string): Promise<SubAccountsLimitResponse> {
    const result: SubAccountsLimitResponse = { data: null, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    const response = await this.mailchannels.get<SubAccountsLimit>(`/tx/v1/sub-account/${handle}/limit`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch sub-account limit.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean(response);
    return result;
  }

  /**
   * Sets the limit for the specified sub-account.
   * @param handle - Handle of the sub-account to set limit for.
   * @param limit - The limits to set for the sub-account. The minimum allowed sends is `0`
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.setLimit('validhandle123', { sends: 1000 })
   * ```
   */
  async setLimit (handle: string, limit: SubAccountsLimit): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.put<{ limit: SubAccountsLimit }>(`/tx/v1/sub-account/${handle}/limit`, {
      body: limit,
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.BadRequest]: "Bad Request.",
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to set sub-account limit.";
    });

    return result;
  }

  /**
   * Deletes the limit for the specified sub-account. After a successful deletion, the specified sub-account will be limited to the parent account's limit.
   * @param handle - Handle of the sub-account to delete limit for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { success, error } = await mailchannels.subAccounts.deleteLimit('validhandle123')
   * ```
   */
  async deleteLimit (handle: string): Promise<SuccessResponse> {
    const result: SuccessResponse = { success: false, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    await this.mailchannels.delete<void>(`/tx/v1/sub-account/${handle}/limit`, {
      ignoreResponseError: true,
      onResponse: async ({ response }) => {
        if (response.ok) {
          result.success = true;
          return;
        }
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch((error) => {
      result.error = error instanceof Error ? error.message : "Failed to delete sub-account limit.";
    });

    return result;
  }

  /**
   * Retrieves usage statistics for the specified sub-account during the current billing period.
   * @param handle - Handle of the sub-account to query usage stats for.
   * @example
   * ```ts
   * const mailchannels = new MailChannels('your-api-key')
   * const { data, error } = await mailchannels.subAccounts.getUsage('validhandle123')
   * ```
   */
  async getUsage (handle: string): Promise<SubAccountsUsageResponse> {
    const result: SubAccountsUsageResponse = { data: null, error: null };

    if (!handle) {
      result.error = "No handle provided.";
      return result;
    }

    const response = await this.mailchannels.get<SubAccountsUsageApiResponse>(`/tx/v1/sub-account/${handle}/usage`, {
      onResponseError: async ({ response }) => {
        result.error = getStatusError(response, {
          [ErrorCode.NotFound]: `Sub-account with handle '${handle}' not found.`
        });
      }
    }).catch((error) => {
      if (!result.error) {
        result.error = error instanceof Error ? error.message : "Failed to fetch sub-account usage.";
      }
      return null;
    });

    if (!response) return result;

    result.data = clean({
      endDate: response.period_end_date,
      startDate: response.period_start_date,
      total: response.total_usage
    });

    return result;
  }
}
