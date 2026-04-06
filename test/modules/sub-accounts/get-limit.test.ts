import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";
import type { SubAccountsLimit, SubAccountsLimitResponse } from "~/types/sub-accounts/limit";

const fake = {
  validHandle: "validhandle123",
  apiResponse: { sends: 1 } satisfies SubAccountsLimit,
  expectedResponse: {
    data: { sends: 1 },
    error: null
  } satisfies SubAccountsLimitResponse
};

describe("getLimit", () => {
  it("should successfully retrieve the limit of a sub-account with a valid handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.getLimit(fake.validHandle);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.getLimit("");

    expect(error).toStrictEqual({ message: "No handle provided.", statusCode: null });
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
    const { data, error } = await subAccounts.getLimit(fake.validHandle);
    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.getLimit(fake.validHandle);
    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.getLimit(fake.validHandle);
    expect(error).toStrictEqual({ message: "Failed to fetch sub-account limit.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
