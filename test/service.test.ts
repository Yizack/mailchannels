import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Service } from "../src/modules/service";

const fake = {
  subscriptions: {
    apiResponse: [
      { id: "sub1", name: "Subscription 1" },
      { id: "sub2", name: "Subscription 2" }
    ]
  }
};

describe("Service", () => {
  describe("status", () => {
    it("should successfully retrieve the service status", async () => {
      const mockClient = {
        get: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
          onResponse({ response: { ok: true } });
        })
      } as unknown as MailChannelsClient;

      const service = new Service(mockClient);
      const result = await service.status();

      expect(result.success).toBe(true);
      expect(mockClient.get).toHaveBeenCalled();
    });

    it("should return an error if the service status cannot be retrieved", async () => {
      const mockClient = {
        get: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
          onResponse({ response: { ok: false } });
        })
      } as unknown as MailChannelsClient;

      const service = new Service(mockClient);
      const result = await service.status();

      expect(result.success).toBe(false);
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

    it("should contain error on api not found", async () => {
      const mockClient = {
        get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
          onResponseError({ response: { ok: false, status: 404 } });
          reject();
        }))
      } as unknown as MailChannelsClient;

      const service = new Service(mockClient);
      const result = await service.subscriptions();

      expect(result.error).toBe("We could not find a customer that matched the customerHandle.");
      expect(result.subscriptions).toEqual([]);
      expect(mockClient.get).toHaveBeenCalled();
    });

    it("should contain error on api unknown error", async () => {
      const mockClient = {
        get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
          onResponseError({ response: { ok: false } });
          reject();
        }))
      } as unknown as MailChannelsClient;

      const service = new Service(mockClient);
      const result = await service.subscriptions();

      expect(result.error).toBe("Unknown error.");
      expect(result.subscriptions).toEqual([]);
      expect(mockClient.get).toHaveBeenCalled();
    });
  });
});
