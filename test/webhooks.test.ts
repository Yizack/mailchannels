import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Webhooks } from "../src/modules/webhooks";
import { ErrorCode } from "../src/utils/errors";
import type { WebhooksListBatchesApiResponse, WebhooksValidateApiResponse } from "../src/types/webhooks/internal";
import type { WebhooksListBatchesResponse } from "../src/types/webhooks/batches";
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
  batches: {
    options: {
      createdAfter: "2026-04-01T00:00:00Z",
      createdBefore: "2026-04-04T00:00:00Z",
      statuses: ["4xx", "5xx"],
      webhook: "https://example.com/webhook",
      limit: 100,
      offset: 10
    } as const,
    apiResponse: {
      webhook_batches: [{
        batch_id: 123,
        created_at: "2026-04-04T12:00:00.000Z",
        customer_handle: "customer-1",
        duration: {
          unit: "milliseconds",
          value: 125
        },
        event_count: 8,
        status: "5xx_response",
        status_code: 500,
        webhook: "https://example.com/webhook"
      }]
    } satisfies WebhooksListBatchesApiResponse,
    expectedResponse: {
      batches: [{
        batchId: 123,
        createdAt: "2026-04-04T12:00:00.000Z",
        customerHandle: "customer-1",
        duration: {
          unit: "milliseconds",
          value: 125
        },
        eventCount: 8,
        status: "5xx_response",
        statusCode: 500,
        webhook: "https://example.com/webhook"
      }],
      error: null
    } satisfies WebhooksListBatchesResponse
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
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/webhook", expect.objectContaining({
      query: {
        endpoint: "https://example.com/webhook"
      }
    }));
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
    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/webhook", expect.objectContaining({}));
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

    expect(error).toBeTruthy();
    expect(webhooksList).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("listBatches", () => {
  it("should successfully list webhook batches", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.batches.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.listBatches(fake.batches.options);

    expect(result).toEqual(fake.batches.expectedResponse);
    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/webhook-batch", expect.objectContaining({
      query: {
        created_after: "2026-04-01T00:00:00Z",
        created_before: "2026-04-04T00:00:00Z",
        statuses: ["4xx", "5xx"],
        webhook: "https://example.com/webhook",
        limit: 100,
        offset: 10
      }
    }));
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;
    const webhooks = new Webhooks(mockClient);

    const result = await webhooks.listBatches({ limit: 501 });

    expect(result.error).toBe("The limit value is invalid. Possible limit values are 1 to 500.");
    expect(result.batches).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;
    const webhooks = new Webhooks(mockClient);

    const result = await webhooks.listBatches({ offset: -1 });

    expect(result.error).toBe("Offset must be greater than or equal to 0.");
    expect(result.batches).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.listBatches();

    expect(result.error).toBeTruthy();
    expect(result.batches).toEqual([]);
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

    expect(mockClient.delete).toHaveBeenCalledWith("/tx/v1/webhook", expect.objectContaining({}));
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
    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/webhook/public-key", expect.objectContaining({
      query: {
        id: "key-id"
      }
    }));
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
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/webhook/validate", expect.objectContaining({
      body: {
        request_id: undefined
      }
    }));
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
