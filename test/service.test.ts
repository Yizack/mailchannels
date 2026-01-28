import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Service } from "../src/modules/service";
import { ErrorCode } from "../src/utils/errors";
import type { ServiceReportOptions } from "../src/types/service/report";

const fake = {
  subscriptions: {
    apiResponse: [
      { id: "sub1", name: "Subscription 1" },
      { id: "sub2", name: "Subscription 2" }
    ]
  },
  report: {
    type: "false_positive",
    messageContent: "This is a test message"
  } satisfies ServiceReportOptions
};

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

describe("subscriptions", () => {
  it("should successfully retrieve a list of subscriptions", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.subscriptions.apiResponse)
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(data).toStrictEqual(fake.subscriptions.apiResponse);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(error).toStrictEqual({ message: "Failed to fetch subscriptions.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("report", () => {
  it("should successfully submit a report", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.report);

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
    const { success, error } = await service.report(fake.report);

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.report);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.report(fake.report);

    expect(error).toStrictEqual({ message: "Failed to submit report.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
