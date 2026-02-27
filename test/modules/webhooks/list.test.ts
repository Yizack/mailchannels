import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { ErrorCode } from "~/utils/errors";
import type { WebhooksListResponse } from "~/types/webhooks/list";

const fake = {
  apiResponse: [
    { webhook: "https://example.com/webhook1" },
    { webhook: "https://example.com/webhook2" }
  ],
  expectedResponse: {
    data: ["https://example.com/webhook1", "https://example.com/webhook2"],
    error: null
  } satisfies WebhooksListResponse
};

describe("list", () => {
  it("should successfully list all webhook endpoints", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.list();

    expect(data).toStrictEqual(fake.expectedResponse.data);
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
