import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import type { SubAccountsCreateApiKeyResponse } from "~/types/sub-accounts/api-key";
import { ErrorCode } from "~/utils/errors";

const fake = {
  validHandle: "validhandle123",
  apiResponse: { id: 1, key: "api-key-value" } satisfies { id: number, key: string },
  expectedResponse: {
    data: { id: 1, value: "api-key-value" },
    error: null
  } satisfies SubAccountsCreateApiKeyResponse
};

describe("createApiKey", () => {
  it("should successfully create an API key for a valid sub-account handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.createApiKey(fake.validHandle);

    expect(result).toStrictEqual(fake.expectedResponse);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createApiKey("");

    expect(error).toStrictEqual({ message: "No handle provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        throw new Error();
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createApiKey(fake.validHandle);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createApiKey(fake.validHandle);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createApiKey(fake.validHandle);

    expect(error).toStrictEqual({ message: "Failed to create sub-account API key.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
