import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { SubAccounts } from "../src/modules/sub-accounts";
import type { SubAccountsListOptions, SubAccountsListResponse } from "../src/types/sub-accounts/list";
import type { SubAccountsCreateApiKeyResponse, SubAccountsListApiKeyOptions, SubAccountsListApiKeyResponse } from "../src/types/sub-accounts/api-key";
import type { SubAccountsSmtpPassword } from "../src/types/sub-accounts/smtp-password";
import type { SubAccountsCreateApiResponse, SubAccountsCreateSmtpPasswordApiResponse, SubAccountsListApiResponse, SubAccountsUsageApiResponse } from "../src/types/sub-accounts/internal";
import type { SubAccountsCreateResponse } from "../src/types/sub-accounts/create";
import type { SubAccountsUsageResponse } from "../src/types/sub-accounts/usage";
import { ErrorCode } from "../src/utils/errors";

const fake = {
  create: {
    validCompanyName: "My Company",
    invalidCompanyName: "a",
    validHandle: "validhandle123",
    invalidHandle: "Invalid_Handle!",
    apiResponse: { company_name: "My Company", enabled: true, handle: "validhandle123" } satisfies SubAccountsCreateApiResponse,
    expectedResponse: {
      account: { companyName: "My Company", enabled: true, handle: "validhandle123" },
      error: null
    } satisfies SubAccountsCreateResponse
  },
  list: {
    options: { limit: 10, offset: 0 } as SubAccountsListOptions,
    apiResponse: [
      { company_name: "My Company", enabled: true, handle: "sub-account-1" },
      { company_name: "Another Company", enabled: false, handle: "sub-account-2" }
    ] satisfies SubAccountsListApiResponse,
    expectedResponse: {
      accounts: [
        { companyName: "My Company", enabled: true, handle: "sub-account-1" },
        { companyName: "Another Company", enabled: false, handle: "sub-account-2" }
      ],
      error: null
    } satisfies SubAccountsListResponse
  },
  createApiKey: {
    apiResponse: { id: 1, key: "api-key-value" },
    expectedResponse: {
      key: { id: 1, value: "api-key-value" },
      error: null
    } satisfies SubAccountsCreateApiKeyResponse
  },
  listApiKeys: {
    options: { limit: 10, offset: 0 } as SubAccountsListApiKeyOptions,
    apiResponse: [
      { id: 1, key: "api-key-1" },
      { id: 2, key: "api-key-2" }
    ],
    expectedResponse: {
      keys: [
        { id: 1, value: "api-key-1" },
        { id: 2, value: "api-key-2" }
      ],
      error: null
    } satisfies SubAccountsListApiKeyResponse
  },
  createSmtpPassword: {
    apiResponse: {
      enabled: true,
      id: 1,
      smtp_password: "smtp-password-value"
    } satisfies SubAccountsCreateSmtpPasswordApiResponse,
    expectedResponse: {
      password: {
        enabled: true,
        id: 1,
        value: "smtp-password-value"
      } satisfies SubAccountsSmtpPassword,
      error: null
    }
  },
  listSmtpPasswords: {
    apiResponse: [
      { enabled: true, id: 1, smtp_password: "password-1" },
      { enabled: false, id: 2, smtp_password: "password-2" }
    ],
    expectedResponse: {
      passwords: [
        { enabled: true, id: 1, value: "password-1" },
        { enabled: false, id: 2, value: "password-2" }
      ] satisfies SubAccountsSmtpPassword[],
      error: null
    }
  },
  getLimit: {
    apiResponse: { sends: 1 },
    expectedResponse: {
      limit: { sends: 1 },
      error: null
    }
  },
  getUsage: {
    apiResponse: {
      period_end_date: "2025-04-11",
      period_start_date: "2025-03-12",
      total_usage: 1234
    } satisfies SubAccountsUsageApiResponse,
    expectedResponse: {
      usage: {
        endDate: "2025-04-11",
        startDate: "2025-03-12",
        total: 1234
      },
      error: null
    } satisfies SubAccountsUsageResponse
  }
};

describe("create", () => {
  it("should successfully create a sub-account with a valid company name and handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account } = await subAccounts.create(fake.create.validCompanyName, fake.create.validHandle);

    expect(account).toEqual(fake.create.expectedResponse.account);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error for an invalid company name", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account, error } = await subAccounts.create(fake.create.invalidCompanyName, fake.create.validHandle);

    expect(error).toBe("Invalid company name. Company name must be between 3 and 128 characters.");
    expect(account).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error for an invalid handle", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account, error } = await subAccounts.create(fake.create.validCompanyName, fake.create.invalidHandle);

    expect(error).toBe("Invalid handle. Sub-account handle must be between 3 and 128 characters and contain only lowercase letters and numbers.");
    expect(account).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should create a sub-account without a handle (random handle)", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account } = await subAccounts.create(fake.create.validCompanyName);

    expect(account).toEqual(fake.create.expectedResponse.account);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account, error } = await subAccounts.create(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(account).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("list", () => {
  it("should retrieve a list of sub-accounts with default options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.list();

    expect(result).toEqual(fake.list.expectedResponse);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should retrieve a list of sub-accounts with custom options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.list(fake.list.options);

    expect(result).toEqual(fake.list.expectedResponse);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { accounts, error } = await subAccounts.list({ limit: 1001 });

    expect(error).toBe("The limit value is invalid. Possible limit values are 1 to 1000.");
    expect(accounts).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { accounts, error } = await subAccounts.list({ offset: -1 });

    expect(error).toBe("Offset must be greater than or equal to 0.");
    expect(accounts).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { accounts, error } = await subAccounts.list();

    expect(error).toBeTruthy();
    expect(accounts).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors when onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { accounts, error } = await subAccounts.list();

    expect(error).toBe("failure");
    expect(accounts).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { accounts, error } = await subAccounts.list();

    expect(error).toBe("Failed to fetch sub-accounts.");
    expect(accounts).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("delete", () => {
  it("should successfully delete a sub-account with a valid handle", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success } = await subAccounts.delete(fake.create.validHandle);

    expect(success).toBe(true);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.delete("");

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.delete(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("suspend", () => {
  it("should successfully suspend a sub-account with a valid handle", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success } = await subAccounts.suspend(fake.create.validHandle);

    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend("");

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.NotFound } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("activate", () => {
  it("should successfully activate a sub-account with a valid handle", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success } = await subAccounts.activate(fake.create.validHandle);

    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.activate("");

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.Forbidden } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.activate(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("createApiKey", () => {
  it("should successfully create an API key for a valid sub-account handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.createApiKey.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.createApiKey(fake.create.validHandle);

    expect(result).toEqual(fake.createApiKey.expectedResponse);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { key, error } = await subAccounts.createApiKey("");

    expect(error).toBe("No handle provided.");
    expect(key).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { key, error } = await subAccounts.createApiKey(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(key).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

});

describe("listApiKeys", () => {
  it("should retrieve a list of api keys for a handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.listApiKeys.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.listApiKeys(fake.create.validHandle, fake.listApiKeys.options);

    expect(result).toEqual(fake.listApiKeys.expectedResponse);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { keys, error } = await subAccounts.listApiKeys("");

    expect(error).toBe("No handle provided.");
    expect(keys).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { keys, error } = await subAccounts.listApiKeys(fake.create.validHandle, { limit: 1001 });

    expect(error).toBe("The limit value is invalid. Possible limit values are 1 to 1000.");
    expect(keys).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { keys, error } = await subAccounts.listApiKeys(fake.create.validHandle, { offset: -1 });

    expect(error).toBe("Offset must be greater than or equal to 0.");
    expect(keys).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { keys, error } = await subAccounts.listApiKeys(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(keys).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("deleteApiKey", () => {
  it("should successfully delete an API key for a valid sub-account handle", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success } = await subAccounts.deleteApiKey(fake.create.validHandle, 1);

    expect(success).toBe(true);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteApiKey("", 1);

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteApiKey(fake.create.validHandle, 1);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("createSmtpPassword", () => {
  it("should successfully create an SMTP password for a valid sub-account handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.createSmtpPassword.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(result).toEqual(fake.createSmtpPassword.expectedResponse);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { password, error } = await subAccounts.createSmtpPassword("");

    expect(error).toBe("No handle provided.");
    expect(password).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { password, error } = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(password).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("listSmtpPasswords", () => {
  it("should retrieve a list of SMTP passwords for a handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.listSmtpPasswords.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.listSmtpPasswords(fake.create.validHandle);

    expect(result).toEqual(fake.listSmtpPasswords.expectedResponse);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { passwords, error } = await subAccounts.listSmtpPasswords("");

    expect(error).toBe("No handle provided.");
    expect(passwords).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { passwords, error } = await subAccounts.listSmtpPasswords(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(passwords).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("deleteSmtpPassword", () => {
  it("should successfully delete an SMTP password for a valid sub-account handle", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success } = await subAccounts.deleteSmtpPassword(fake.create.validHandle, 1);

    expect(success).toBe(true);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteSmtpPassword("", 1);

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteSmtpPassword(fake.create.validHandle, 1);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("getLimit", () => {
  it("should successfully retrieve the limit of a sub-account with a valid handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.getLimit.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { limit, error } = await subAccounts.getLimit(fake.create.validHandle);

    expect(limit).toEqual(fake.getLimit.expectedResponse.limit);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { limit, error } = await subAccounts.getLimit("");

    expect(error).toBe("No handle provided.");
    expect(limit).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { limit, error } = await subAccounts.getLimit(fake.create.validHandle);
    expect(error).toBeTruthy();
    expect(limit).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("setLimit", () => {
  it("should successfully set the limit of a sub-account with a valid handle", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit(fake.create.validHandle, { sends: 1 });

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit("", { sends: 1 });

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit(fake.create.validHandle, { sends: 1 });

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });
});

describe("deleteLimit", () => {
  it("should successfully delete the limit of a sub-account with a valid handle", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteLimit(fake.create.validHandle);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteLimit("");

    expect(error).toBe("No handle provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.deleteLimit(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("getUsage", () => {
  it("should successfully retrieve the usage of a sub-account with a valid handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.getUsage.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { usage, error } = await subAccounts.getUsage(fake.create.validHandle);

    expect(usage).toEqual(fake.getUsage.expectedResponse.usage);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { usage, error } = await subAccounts.getUsage("");

    expect(error).toBe("No handle provided.");
    expect(usage).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { usage, error } = await subAccounts.getUsage(fake.create.validHandle);

    expect(error).toBeTruthy();
    expect(usage).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
