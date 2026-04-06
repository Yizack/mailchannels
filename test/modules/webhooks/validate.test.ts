import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { ErrorCode } from "~/utils/errors";
import type { WebhooksValidateResponse } from "~/types";
import type { WebhooksValidateApiResponse } from "~/types/webhooks/internal";

const fake = {
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
};

describe("validate", () => {
  it("should successfully validate webhook endpoints", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { data, error } = await webhooks.validate();

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
