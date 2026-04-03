import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { ErrorCode } from "~/utils/errors";
import type { WebhooksBatchesApiResponse } from "~/types/webhooks/internal";
import type { WebhooksBatchesOptions, WebhooksBatchesResponse } from "~/types/webhooks/batches";

const fake = {
  options: {
    webhook: "https://example.com/webhook"
  } satisfies WebhooksBatchesOptions,
  apiResponse: {
    webhook_batches: [
      {
        batch_id: 1,
        created_at: "2024-07-29T15:51:28.071Z",
        customer_handle: "test-customer",
        duration: { unit: "milliseconds", value: 120 },
        event_count: 5,
        status: "2xx_response",
        status_code: 200,
        webhook: "https://example.com/webhook"
      }
    ]
  } satisfies WebhooksBatchesApiResponse,
  expectedResponse: {
    data: [
      {
        batchId: 1,
        createdAt: "2024-07-29T15:51:28.071Z",
        customerHandle: "test-customer",
        duration: { unit: "milliseconds", value: 120 },
        eventCount: 5,
        status: "2xx_response",
        statusCode: 200,
        webhook: "https://example.com/webhook"
      }
    ],
    error: null
  } satisfies WebhooksBatchesResponse
};

describe("batches", () => {
  it("should successfully retrieve webhook batches", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches(fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit (0)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ ...fake.options, limit: 0 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 500.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid limit (501)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ ...fake.options, limit: 501 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 500.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ ...fake.options, offset: -1 });

    expect(error).toStrictEqual({ message: "Offset must be greater than or equal to 0.", statusCode: null });
    expect(data).toBeNull();
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
    const { data, error } = await webhooks.batches();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches();

    expect(error).toStrictEqual({ message: "Failed to fetch webhook batches.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
