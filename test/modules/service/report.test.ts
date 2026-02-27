import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Service } from "~/modules/service";
import type { ServiceReportOptions } from "~/types/service/report";

const fake = {
  options: {
    type: "false_positive",
    messageContent: "This is a test message"
  } satisfies ServiceReportOptions
};

describe("report", () => {
  it("should successfully submit a report", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.options);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 500 } });
      })
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.options);

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.options);

    expect(error).toStrictEqual({ message: "Failed to submit report.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
