import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Webhooks } from "../src/modules/webhooks";
import { ErrorCode } from "../src/utils/errors";
import type { WebhooksValidateApiResponse } from "../src/types/webhooks/internal";
import type { WebhooksValidateResponse } from "../src/types/webhooks/validate";
import type { WebhooksListResponse } from "../src/types/webhooks/list";
import type { WebhooksSigningKeyResponse } from "../src/types/webhooks/signing-key";

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
      data: ["https://example.com/webhook1", "https://example.com/webhook2"]
    } satisfies WebhooksListResponse
  },
  signingKey: {
    id: "key-id",
    apiResponse: { id: "key-id", key: "public-key" },
    expectedResponse: {
      data: { key: "public-key" },
      error: null
    } satisfies WebhooksSigningKeyResponse
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
      data: {
        allPassed: true,
        results: [{
          result: "passed",
          webhook: "https://example.com/webhook",
          response: {
            status: 200
          }
        }]
      },
      error: null
    } satisfies WebhooksValidateResponse
  }
};

describe("enroll", () => {
  it("should successfully enroll a webhook endpoint", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.enroll.endpoint);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error if the endpoint is not provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const webhooks = new Webhooks(mockClient);
    // @ts-expect-error Testing missing endpoint error
    const { success, error } = await webhooks.enroll();

    expect(error).toStrictEqual({ message: "No endpoint provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error if the endpoint exceeds maximum length", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const longEndpoint = "https://example.com/" + "a".repeat(7990);

    const { success, error } = await webhooks.enroll(longEndpoint);

    expect(error).toStrictEqual({ message: "The endpoint exceeds the maximum length of 8000 characters.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.Conflict } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.enroll.endpoint);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.enroll.endpoint);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.enroll.endpoint);

    expect(error).toStrictEqual({ message: "Failed to enroll webhook.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("list", () => {
  it("should successfully list all webhook endpoints", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.list();

    expect(data).toStrictEqual(fake.list.expectedResponse.data);
    expect(error).toBeNull();
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
    const { data, error } = await webhooks.list();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.list();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.list();

    expect(error).toStrictEqual({ message: "Failed to fetch webhooks.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("delete", () => {
  it("should successfully delete all webhook endpoints", async () => {
    const mockClient = {
      delete: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.delete();

    expect(mockClient.delete).toHaveBeenCalled();
    expect(error).toBeNull();
    expect(success).toBe(true);
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 500 } });
      })
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.delete();

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.delete();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.delete();

    expect(error).toStrictEqual({ message: "Failed to delete webhooks.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("getSigningKey", () => {
  it("should successfully retrieve a signing key", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.signingKey.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.signingKey.id);

    expect(data).toStrictEqual(fake.signingKey.expectedResponse.data);
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

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.signingKey.id);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.signingKey.id);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.signingKey.id);

    expect(error).toStrictEqual({ message: "Failed to get signing key.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("validate", () => {
  it("should successfully validate webhook endpoints", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.validateResponse.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.validate();

    expect(data).toStrictEqual(fake.validateResponse.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.validate();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when requestId has more than 28 characters", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.validate("this-request-id-is-way-too-long");

    expect(error).toStrictEqual({ message: "The request id should not exceed 28 characters.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.validate();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.validate();

    expect(error).toStrictEqual({ message: "Failed to validate webhooks.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
