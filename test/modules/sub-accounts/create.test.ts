import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";
import type { SubAccountsCreateResponse } from "~/types/sub-accounts/create";
import type { SubAccountsCreateApiResponse } from "~/types/sub-accounts/internal";

const fake = {
  validCompanyName: "My Company",
  invalidCompanyName: "a",
  validHandle: "validhandle123",
  invalidHandle: "Invalid_Handle!",
  apiResponse: { company_name: "My Company", enabled: true, handle: "validhandle123" } satisfies SubAccountsCreateApiResponse,
  expectedResponse: {
    data: { companyName: "My Company", enabled: true, handle: "validhandle123" },
    error: null
  } satisfies SubAccountsCreateResponse
};

describe("create", () => {
  it("should successfully create a sub-account with a valid company name and handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.validCompanyName, fake.validHandle);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error for an invalid company name", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.invalidCompanyName, fake.validHandle);

    expect(error).toStrictEqual({ message: "Invalid company name. Company name must be between 3 and 128 characters.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error for an invalid handle", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.validCompanyName, fake.invalidHandle);

    expect(error).toStrictEqual({ message: "Invalid handle. Sub-account handle must be between 3 and 128 characters and contain only lowercase letters and numbers.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should create a sub-account without a handle (random handle)", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.validCompanyName);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        throw new Error();
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.validHandle);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.validHandle);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.create(fake.validHandle);

    expect(error).toStrictEqual({ message: "Failed to create sub-account.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
