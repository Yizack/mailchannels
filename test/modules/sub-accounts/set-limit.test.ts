import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { SubAccounts } from "~/modules/sub-accounts";
import { ErrorCode } from "~/utils/errors";

const fake = {
  validHandle: "validhandle123"
};

describe("setLimit", () => {
  it("should successfully set the limit of a sub-account with a valid handle", async () => {
    const mockClient = {
      put: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit(fake.validHandle, { sends: 1 });

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when handle is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit("", { sends: 1 });

    expect(error).toStrictEqual({ message: "No handle provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit(fake.validHandle, { sends: 1 });

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit(fake.validHandle, { sends: 1 });

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const { success, error } = await subAccounts.setLimit(fake.validHandle, { sends: 1 });

    expect(error).toStrictEqual({ message: "Failed to set sub-account limit.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });
});
