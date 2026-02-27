import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";
import type { SubAccountsListSmtpPasswordResponse } from "~/types/sub-accounts/smtp-password";
import type { SubAccountsCreateSmtpPasswordApiResponse } from "~/types/sub-accounts/internal";

const fake = {
  validHandle: "validhandle123",
  apiResponse: [
    { enabled: true, id: 1, smtp_password: "password-1" },
    { enabled: false, id: 2, smtp_password: "password-2" }
  ] satisfies SubAccountsCreateSmtpPasswordApiResponse[],
  expectedResponse: {
    data: [
      { enabled: true, id: 1, value: "password-1" },
      { enabled: false, id: 2, value: "password-2" }
    ],
    error: null
  } satisfies SubAccountsListSmtpPasswordResponse
};

describe("listSmtpPasswords", () => {
  it("should retrieve a list of SMTP passwords for a handle", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listSmtpPasswords(fake.validHandle);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listSmtpPasswords("");

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
    const { data, error } = await subAccounts.listSmtpPasswords(fake.validHandle);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listSmtpPasswords(fake.validHandle);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { data, error } = await subAccounts.listSmtpPasswords(fake.validHandle);

    expect(error).toStrictEqual({ message: "Failed to fetch sub-account SMTP passwords.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
