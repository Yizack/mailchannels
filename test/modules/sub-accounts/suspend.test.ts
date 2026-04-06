import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";

const fake = {
  validHandle: "validhandle123"
};

describe("suspend", () => {
  it("should successfully suspend a sub-account with a valid handle", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend(fake.validHandle);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend("");

    expect(error).toStrictEqual({ message: "No handle provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend(fake.validHandle);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend(fake.validHandle);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.suspend(fake.validHandle);

    expect(error).toStrictEqual({ message: "Failed to suspend sub-account.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
