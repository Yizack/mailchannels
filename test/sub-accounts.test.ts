import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { SubAccounts } from "../src/modules/sub-accounts";
import type { SubAccountsAccount } from "../src/types/sub-accounts/create";
import type { SubAccountsListOptions } from "../src/types/sub-accounts/list";
import type { SubAccountsApiKey } from "../src/types/sub-accounts/api-key";
import type { SubAccountsSmtpPassword } from "../src/types/sub-accounts/smtp-password";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "../src/types/sub-accounts/internal";
import { Logger } from "../src/utils/logger";

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
      ] as SubAccountsAccount[]
    }
  },
  createApiKey: {
    apiResponse: { id: 1, key: "api-key-value" },
    expectedResponse: {
      key: { id: 1, value: "api-key-value" } as SubAccountsApiKey
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
      ] as SubAccountsApiKey[]
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
      } as SubAccountsSmtpPassword
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
      ] as SubAccountsSmtpPassword[]
    }
  }
};

describe("create", () => {
  it("should successfully create a sub-account with a valid handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.create(fake.create.validHandle);

    expect(result).toEqual({ account: fake.create.apiResponse });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should log an error for an invalid handle", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { account } = await subAccounts.create(fake.create.invalidHandle);

    expect(spyLogger).toHaveBeenCalledWith("Invalid handle. Sub-account handle must match the pattern [a-z0-9]{3,128}");
    expect(account).toBeUndefined();
    expect(mockClient.post).not.toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should create a sub-account without a handle (random handle)", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.create();

    expect(result).toEqual({ account: fake.create.apiResponse });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should log an error on api forbidden", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 403 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { account } = await subAccounts.create(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("The parent account does not have permission to create sub-accounts.");
    expect(account).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api conflict", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 409 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { account } = await subAccounts.create(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`Sub-account with handle ${fake.create.validHandle} already exists.`);
    expect(account).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error for invalid limit or offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { accounts } = await subAccounts.list({ limit: 1001 });

    expect(spyLogger).toHaveBeenCalledWith("The limit and/or offset query parameter are invalid.");
    expect(accounts).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError();
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { accounts } = await subAccounts.list();

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(accounts).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
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
    const result = await subAccounts.delete(fake.create.validHandle);

    expect(result).toEqual({ success: true });
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.delete(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
    spyLogger.mockRestore();
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
    const result = await subAccounts.suspend(fake.create.validHandle);

    expect(result).toEqual({ success: true });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should log an error on api handle not found", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 404 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.suspend(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`The specified sub-account ${fake.create.validHandle} does not exist.`);
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.suspend(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
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
    const result = await subAccounts.activate(fake.create.validHandle);

    expect(result).toEqual({ success: true });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it ("should log an error on api forbidden", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 403 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.activate(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("The parent account does not have permission to activate the sub-account.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api handle not found", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 404 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.activate(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`The specified sub-account ${fake.create.validHandle} does not exist.`);
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.activate(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api forbidden", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 403 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { key } = await subAccounts.createApiKey(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("You can't create API keys for this sub-account.");
    expect(key).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api handle not found", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 404 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { key } = await subAccounts.createApiKey(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`Sub-account with handle '${fake.create.validHandle}' not found.`);
    expect(key).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("shoud log an error on keys limit", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 422 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { key } = await subAccounts.createApiKey(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("You have reached the limit of API keys you can create for this sub-account.");
    expect(key).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 500 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { key } = await subAccounts.createApiKey(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(key).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api handle not found", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 404 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { keys } = await subAccounts.listApiKeys(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`Sub-account with handle '${fake.create.validHandle}' not found.`);
    expect(keys).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 500 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { keys } = await subAccounts.listApiKeys(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(keys).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api bad request", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 400 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.deleteApiKey(fake.create.validHandle, 1);

    expect(spyLogger).toHaveBeenCalledWith("Missing or invalid API key ID.");
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.deleteApiKey(fake.create.validHandle, 1);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api forbidden", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 403 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { password } = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("You can't create SMTP passwords for this sub-account.");
    expect(password).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api handle not found", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 404 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { password } = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`Sub-account with handle '${fake.create.validHandle}' not found.`);
    expect(password).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api smtp password limit", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 422 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { password } = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("You have reached the limit of SMTP passwords you can create for this sub-account.");
    expect(password).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 500 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { password } = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(password).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api handle not found", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 404 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { passwords } = await subAccounts.listSmtpPasswords(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith(`Sub-account with handle '${fake.create.validHandle}' not found.`);
    expect(passwords).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: 500 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { passwords } = await subAccounts.listSmtpPasswords(fake.create.validHandle);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(passwords).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api bad request", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 400 } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.deleteSmtpPassword(fake.create.validHandle, 1);

    expect(spyLogger).toHaveBeenCalledWith("Missing or invalid SMTP password ID.");
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await subAccounts.deleteSmtpPassword(fake.create.validHandle, 1);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
    spyLogger.mockRestore();
  });
});
