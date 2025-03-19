import { describe, it, expect, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { SubAccounts } from "../src/modules/sub-accounts";
import type { SubAccountsListOptions, SubAccountsListResponse } from "../src/types/sub-accounts/list";
import type { SubAccountsCreateApiKeyResponse } from "../src/types/sub-accounts/create-api-key";
import type { SubAccountsCreateSmtpPasswordResponse } from "../src/types/sub-accounts/create-smtp-password";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "../src/types/sub-accounts/internal";

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
    ] as SubAccountsListResponse["accounts"],
    expectedResponse: {
      accounts: [
        { enabled: true, handle: "sub-account-1" },
        { enabled: false, handle: "sub-account-2" }
      ]
    } as SubAccountsListResponse
  },
  createApiKey: {
    apiResponse: { id: 1, key: "api-key-value" } as SubAccountsCreateApiKeyResponse
  },
  createSmtpPassword: {
    apiResponse: {
      enabled: true,
      id: 1,
      smtp_password: "smtp-password-value"
    } as SubAccountsCreateSmtpPasswordApiResponse,
    expectedResponse: {
      enabled: true,
      id: 1,
      password: "smtp-password-value"
    } as SubAccountsCreateSmtpPasswordResponse
  }
};

describe("create", () => {
  it("should successfully create a sub-account with a valid handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.create(fake.create.validHandle);

    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/sub-account", {
      body: { handle: fake.create.validHandle }
    });
    expect(result).toEqual({ account: fake.create.apiResponse });
  });

  it("should throw an error for an invalid handle", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);

    await expect(subAccounts.create(fake.create.invalidHandle)).rejects.toThrow(
      "Invalid handle. Sub-account handle must match the pattern [a-z0-9]{3,128}"
    );
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should create a sub-account without a handle (random handle)", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.create();

    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/sub-account", {
      body: undefined
    });
    expect(result).toEqual({ account: fake.create.apiResponse });
  });
});

describe("list", () => {
  it("should retrieve a list of sub-accounts with default options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.list();

    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/sub-account", {
      query: undefined
    });
    expect(result).toEqual(fake.list.expectedResponse);
  });

  it("should retrieve a list of sub-accounts with custom options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.list(fake.list.options);

    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/sub-account", {
      query: fake.list.options
    });
    expect(result).toEqual(fake.list.expectedResponse);
  });
});

describe("createApiKey", () => {
  it("should successfully create an API key for a valid sub-account handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.createApiKey.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.createApiKey(fake.create.validHandle);

    expect(mockClient.post).toHaveBeenCalledWith(`/tx/v1/sub-account/${fake.create.validHandle}/api-key`);
    expect(result).toEqual(fake.createApiKey.apiResponse);
  });
});

describe("createSmtpPassword", () => {
  it("should successfully create an SMTP password for a valid sub-account handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.createSmtpPassword.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.createSmtpPassword(fake.create.validHandle);

    expect(mockClient.post).toHaveBeenCalledWith(`/tx/v1/sub-account/${fake.create.validHandle}/smtp-password`);
    expect(result).toEqual(fake.createSmtpPassword.expectedResponse);
  });
});
