import { expect, it, vi, describe } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Webhooks } from "../src/modules/webhooks";
import { Logger } from "../src/utils/logger";

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
      webhooks: ["https://example.com/webhook1", "https://example.com/webhook2"]
    }
  },
  signingKey: {
    id: "key-id",
    apiResponse: { key: "public-key" }
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

  it("should log an error if the endpoint is not provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const webhooks = new Webhooks(mockClient);

    const spyLogger = vi.spyOn(Logger, "error");
    // @ts-expect-error Testing missing endpoint error
    const { success } = await webhooks.enroll();

    expect(spyLogger).toHaveBeenCalledWith("No endpoint provided.");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it ("should log an error on api conflict", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false, status: 409 } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");

    const { success } = await webhooks.enroll(fake.enroll.endpoint);

    expect(spyLogger).toHaveBeenCalledWith(`${fake.enroll.endpoint} is already enrolled to receive notifications.`);
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");

    const { success } = await webhooks.enroll(fake.enroll.endpoint);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, rejects) => {
        onResponseError({ response: { ok: false } });
        rejects();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");

    const result = await webhooks.list();

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(result).toEqual({ webhooks: [] });
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");

    const { success } = await webhooks.delete();

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
    spyLogger.mockRestore();
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

  it("should log an error on api key not found", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { ok: false, status: 404 } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");

    const result = await webhooks.getSigningKey(fake.signingKey.id);

    expect(spyLogger).toHaveBeenCalledWith(`The key '${fake.signingKey.id}' is not found.`);
    expect(result.key).toBeUndefined();
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, rejects) => {
        onResponseError({ response: { ok: false } });
        rejects();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");

    const result = await webhooks.getSigningKey(fake.signingKey.id);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(result.key).toBeUndefined();
    expect(mockClient.get).toHaveBeenCalled();
    spyLogger.mockRestore();
  });
});
