import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { ErrorCode } from "~/utils/errors";
import type { WebhooksSigningKeyResponse } from "~/types/webhooks/signing-key";

const fake = {
  id: "key-id",
  apiResponse: { id: "key-id", key: "public-key" },
  expectedResponse: {
    data: { id: "key-id", key: "public-key" },
    error: null
  } satisfies WebhooksSigningKeyResponse
};

describe("getSigningKey", () => {
  it("should successfully retrieve a signing key", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.id);

    expect(data).toStrictEqual(fake.expectedResponse.data);
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
    const { data, error } = await webhooks.getSigningKey(fake.id);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.id);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.getSigningKey(fake.id);

    expect(error).toStrictEqual({ message: "Failed to get signing key.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
