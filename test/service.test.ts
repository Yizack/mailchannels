import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Service } from "../src/modules/service";
import { ErrorCode } from "../src/utils/errors";

const fake = {
  subscriptions: {
    apiResponse: [
      { id: "sub1", name: "Subscription 1" },
      { id: "sub2", name: "Subscription 2" }
    ]
  }
};

describe("status", () => {
  it("should successfully retrieve the service status", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success } = await service.status();

    expect(success).toBe(true);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { success, error } = await service.status();

    expect(success).toBe(false);
    expect(error).toBeDefined();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("subscriptions", () => {
  it("should successfully retrieve a list of subscriptions", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.subscriptions.apiResponse)
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const result = await service.subscriptions();

    expect(result.subscriptions).toEqual(fake.subscriptions.apiResponse);
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
    const { subscriptions, error } = await service.subscriptions();

    expect(error).toBeDefined();
    expect(subscriptions).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});
