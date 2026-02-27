import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";
import type { SubAccountsCreateSmtpPasswordResponse } from "~/types/sub-accounts/smtp-password";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "~/types/sub-accounts/internal";

const fake = {
  validHandle: "validhandle123",
  apiResponse: {
    enabled: true,
    id: 1,
    smtp_password: "smtp-password-value"
  } satisfies SubAccountsCreateSmtpPasswordApiResponse,
  expectedResponse: {
    data: {
      enabled: true,
      id: 1,
      value: "smtp-password-value"
    },
    error: null
  } satisfies SubAccountsCreateSmtpPasswordResponse
};

describe("createSmtpPassword", () => {
  it("should successfully create an SMTP password for a valid sub-account handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createSmtpPassword(fake.validHandle);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createSmtpPassword("");

    expect(error).toStrictEqual({ message: "No handle provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        throw new Error();
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createSmtpPassword(fake.validHandle);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createSmtpPassword(fake.validHandle);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.createSmtpPassword(fake.validHandle);

    expect(error).toStrictEqual({ message: "Failed to create sub-account SMTP password.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
