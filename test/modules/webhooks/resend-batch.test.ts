import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { ErrorCode } from "~/utils/errors";
import type { WebhooksResendBatchApiResponse } from "~/types/webhooks/internal";
import type { WebhooksResendBatchResponse } from "~/types/webhooks/resend-batch";

const fake = {
  batchId: 123,
  apiResponse: {
    batch_id: 123,
    customer_handle: "test",
    webhook: "https://127.0.0.1/webhooks",
    status_code: 200,
    duration_in_ms: 1294,
    created_at: "2026-04-10T03:34:27.511881626Z",
    event_count: 2
  } satisfies WebhooksResendBatchApiResponse,
  expectedResponse: {
    data:
      {
        batchId: 123,
        customerHandle: "test",
        webhook: "https://127.0.0.1/webhooks",
        createdAt: "2026-04-10T03:34:27.511881626Z",
        eventCount: 2,
        duration: 1294,
        statusCode: 200
      },
    error: null
  } satisfies WebhooksResendBatchResponse
};

describe("resend-batch", () => {
  it("should successfully resend webhook batch", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.resendBatch(fake.batchId);

    expect(data).toStrictEqual(fake.expectedResponse.data);
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
    const { data, error } = await webhooks.resendBatch(fake.batchId);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.resendBatch(fake.batchId);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.resendBatch(fake.batchId);

    expect(error).toStrictEqual({ message: "Failed to resend webhook batch.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
