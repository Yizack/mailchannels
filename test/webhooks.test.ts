import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Webhooks } from "../src/modules/webhooks";
import { ErrorCode } from "../src/utils/errors";

const fake = {
  enroll: {
    endpoint: "https://example.com/webhook"
  },
  list: {
    apiResponse: [
      { webhook: "https://example.com/webhook1" },
      { webhook: "https://example.com/webhook2" }
    ],
    expectedResponse: {
      error: null,
      webhooks: ["https://example.com/webhook1", "https://example.com/webhook2"]
    }
  },
  signingKey: {
    id: "key-id",
    apiResponse: { error: null, key: "public-key" }
  }
};

describe("enroll", () => {
  it("should successfully enroll a webhook endpoint", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success } = await webhooks.enroll(fake.enroll.endpoint);

    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error if the endpoint is not provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const webhooks = new Webhooks(mockClient);
    // @ts-expect-error Testing missing endpoint error
    const { success, error } = await webhooks.enroll();

    expect(error).toBe("No endpoint provided.");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.Conflict } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.enroll.endpoint);

    expect(error).toBeDefined();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("list", () => {
  it("should successfully list all webhook endpoints", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.list();

    expect(result).toEqual(fake.list.expectedResponse);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { webhooks: webhooksList, error } = await webhooks.list();

    expect(error).toBeDefined();
    expect(webhooksList).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("delete", () => {
  it("should successfully delete all webhook endpoints", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success } = await webhooks.delete();

    expect(mockClient.delete).toHaveBeenCalled();
    expect(success).toBe(true);
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.delete();

    expect(error).toBeDefined();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("getSigningKey", () => {
  it("should successfully retrieve a signing key", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.signingKey.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.getSigningKey(fake.signingKey.id);

    expect(result).toEqual(fake.signingKey.apiResponse);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { key, error } = await webhooks.getSigningKey(fake.signingKey.id);

    expect(error).toBeDefined();
    expect(key).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
