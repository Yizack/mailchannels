import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Service } from "~/modules/service";

describe("status", () => {
  it("should successfully retrieve the service status", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.status();

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 500 } });
      })
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.status();

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.status();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.status();

    expect(error).toStrictEqual({ message: "Failed to fetch service status.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.get).toHaveBeenCalled();
  });
});
