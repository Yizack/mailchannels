import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";
import type { SubAccountsListOptions, SubAccountsListResponse } from "~/types/sub-accounts/list";
import type { SubAccountsListApiResponse } from "~/types/sub-accounts/internal";

const fake = {
  options: { limit: 10, offset: 0 } satisfies SubAccountsListOptions,
  apiResponse: [
    { company_name: "My Company", enabled: true, handle: "sub-account-1" },
    { company_name: "Another Company", enabled: false, handle: "sub-account-2" }
  ] satisfies SubAccountsListApiResponse,
  expectedResponse: {
    data: [
      { companyName: "My Company", enabled: true, handle: "sub-account-1" },
      { companyName: "Another Company", enabled: false, handle: "sub-account-2" }
    ],
    error: null
  } satisfies SubAccountsListResponse
};

describe("list", () => {
  it("should retrieve a list of sub-accounts with default options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list();

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should retrieve a list of sub-accounts with custom options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list(fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list({ limit: 1001 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 1000.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list({ offset: -1 });

    expect(error).toStrictEqual({ message: "Offset must be greater than or equal to 0.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        throw new Error();
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.list();

    expect(error).toStrictEqual({ message: "Failed to fetch sub-accounts.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
