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

  it("should successfully retrieve webhook batches with valid date range", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ createdAfter: "2024-07-01", createdBefore: "2024-07-08" });

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

  it("should contain error for too many statuses (more than 6)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ statuses: ["1xx", "2xx", "3xx", "4xx", "5xx", "no_response", "1xx"] });

    expect(error).toStrictEqual({ message: "A maximum of 6 status filters can be provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for duplicate statuses", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ statuses: ["2xx", "2xx"] });

    expect(error).toStrictEqual({ message: "Status filters must be unique.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid createdAfter", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ createdAfter: "not-a-date" });

    expect(error).toStrictEqual({ message: "createdAfter must be a valid date string.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid createdBefore", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ createdBefore: "not-a-date" });

    expect(error).toStrictEqual({ message: "createdBefore must be a valid date string.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error when createdBefore is not later than createdAfter", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ createdAfter: "2024-07-29", createdBefore: "2024-07-28" });

    expect(error).toStrictEqual({ message: "createdBefore must be later than createdAfter.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error when time range exceeds 31 days", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.batches({ createdAfter: "2024-07-01", createdBefore: "2024-08-02" });

    expect(error).toStrictEqual({ message: "The time range between createdAfter and createdBefore must not exceed 31 days.", statusCode: null });
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
