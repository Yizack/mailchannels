import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import type { SubAccountsListApiKeyOptions, SubAccountsListApiKeyResponse } from "~/types/sub-accounts/api-key";
import { ErrorCode } from "~/utils/errors";

const fake = {
  validHandle: "validhandle123",
  options: { limit: 10, offset: 0 } satisfies SubAccountsListApiKeyOptions,
  apiResponse: [
    { id: 1, key: "api-key-1" },
    { id: 2, key: "api-key-2" }
  ] satisfies { id: number, key: string }[],
  expectedResponse: {
    data: [
      { id: 1, value: "api-key-1" },
      { id: 2, value: "api-key-2" }
    ],
    error: null
  } satisfies SubAccountsListApiKeyResponse
};

describe("listApiKeys", () => {
  it("should retrieve a list of api keys for a handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys(fake.validHandle, fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys("");

    expect(error).toStrictEqual({ message: "No handle provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys(fake.validHandle, { limit: 1001 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 1000.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys(fake.validHandle, { offset: -1 });

    expect(error).toStrictEqual({ message: "Offset must be greater than or equal to 0.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        throw new Error();
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys(fake.validHandle);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys(fake.validHandle);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listApiKeys(fake.validHandle);

    expect(error).toStrictEqual({ message: "Failed to fetch sub-account API keys.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
