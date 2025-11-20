import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Webhooks } from "../src/modules/webhooks";
import { ErrorCode } from "../src/utils/errors";
import type { WebhooksValidateApiResponse } from "../src/types/webhooks/internal";
import type { WebhooksValidateResponse } from "../src/types/webhooks/validate";

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
  },
  validateResponse: {
    apiResponse: {
      all_passed: true,
      results: [{
        result: "passed",
        webhook: "https://example.com/webhook",
        response: {
          status: 200
        }
      }]
    } satisfies WebhooksValidateApiResponse,
    expectedResponse: {
      allPassed: true,
      results: [{
        result: "passed",
        webhook: "https://example.com/webhook",
        response: {
          status: 200
        }
      }],
      error: null
    } satisfies WebhooksValidateResponse
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

  it("should contain error if the endpoint exceeds maximum length", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const longEndpoint = "https://example.com/" + "a".repeat(7990);

    const { success, error } = await webhooks.enroll(longEndpoint);

    expect(error).toBe("The endpoint exceeds the maximum length of 8000 characters.");
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

    expect(error).toBeTruthy();
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
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { webhooks: list, error } = await webhooks.list();

    expect(error).toBeTruthy();
    expect(list).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors when onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { webhooks: list, error } = await webhooks.list();

    expect(error).toBe("failure");
    expect(list).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { webhooks: list, error } = await webhooks.list();

    expect(error).toBe("Failed to fetch webhooks.");
    expect(list).toEqual([]);
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

    expect(error).toBeTruthy();
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
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { key, error } = await webhooks.getSigningKey(fake.signingKey.id);

    expect(error).toBeTruthy();
    expect(key).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("validate", () => {
  it("should successfully validate webhook endpoints", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.validateResponse.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.validate();

    expect(result).toEqual(fake.validateResponse.expectedResponse);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { allPassed, results, error } = await webhooks.validate();

    expect(error).toBeTruthy();
    expect(allPassed).toBe(false);
    expect(results).toEqual([]);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when requestId has more than 28 characters", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { allPassed, results, error } = await webhooks.validate("this-request-id-is-way-too-long");

    expect(error).toBe("The request id should not exceed 28 characters.");
    expect(allPassed).toBe(false);
    expect(results).toEqual([]);
    expect(mockClient.post).not.toHaveBeenCalled();
  });
});
