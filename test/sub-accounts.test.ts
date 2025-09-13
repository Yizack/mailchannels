import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { SubAccounts } from "../src/modules/sub-accounts";
import type { SubAccountsAccount } from "../src/types/sub-accounts/create";
import type { SubAccountsListOptions } from "../src/types/sub-accounts/list";
import type { SubAccountsApiKey } from "../src/types/sub-accounts/api-key";
import type { SubAccountsSmtpPassword } from "../src/types/sub-accounts/smtp-password";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "../src/types/sub-accounts/internal";
import { ErrorCode } from "../src/utils/errors";

const fake = {
  create: {
    validHandle: "validhandle123",
    invalidHandle: "Invalid_Handle!",
    apiResponse: { enabled: true, handle: "validhandle123" }
  },
  list: {
    options: { limit: 10, offset: 0 } as SubAccountsListOptions,
    apiResponse: [
      { enabled: true, handle: "sub-account-1" },
      { enabled: false, handle: "sub-account-2" }
    ] as SubAccountsAccount[],
    expectedResponse: {
      accounts: [
        { enabled: true, handle: "sub-account-1" },
        { enabled: false, handle: "sub-account-2" }
      ] as SubAccountsAccount[],
      error: null
    }
  },
  createApiKey: {
    apiResponse: { id: 1, key: "api-key-value" },
    expectedResponse: {
      key: { id: 1, value: "api-key-value" } as SubAccountsApiKey,
      error: null
    }
  },
  listApiKeys: {
    apiResponse: [
      { id: 1, key: "api-key-1" },
      { id: 2, key: "api-key-2" }
    ],
    expectedResponse: {
      keys: [
        { id: 1, value: "api-key-1" },
        { id: 2, value: "api-key-2" }
      ] as SubAccountsApiKey[],
      error: null
    }
  },
  createSmtpPassword: {
    apiResponse: {
      enabled: true,
      id: 1,
      smtp_password: "smtp-password-value"
    } as SubAccountsCreateSmtpPasswordApiResponse,
    expectedResponse: {
      password: {
        enabled: true,
        id: 1,
        value: "smtp-password-value"
      } as SubAccountsSmtpPassword,
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
      ] as SubAccountsSmtpPassword[],
      error: null
    }
  }
};

describe("create", () => {
  it("should successfully create a sub-account with a valid handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account } = await subAccounts.create(fake.create.validHandle);

    expect(account).toEqual(fake.create.apiResponse);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error for an invalid handle", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account, error } = await subAccounts.create(fake.create.invalidHandle);

    expect(error).toBe("Invalid handle. Sub-account handle must match the pattern [a-z0-9]{3,128}");
    expect(account).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should create a sub-account without a handle (random handle)", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { account } = await subAccounts.create();

    expect(account).toEqual(fake.create.apiResponse);
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
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { accounts, error } = await subAccounts.list();

    expect(error).toBeTruthy();
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
    const result = await subAccounts.listApiKeys(fake.create.validHandle);

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
