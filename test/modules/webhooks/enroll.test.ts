import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Webhooks } from "~/modules/webhooks";
import { ErrorCode } from "~/utils/errors";

const fake = {
  endpoint: "https://example.com/webhook"
};

describe("enroll", () => {
  it("should successfully enroll a webhook endpoint", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.endpoint);

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
    const { success, error } = await webhooks.enroll(fake.endpoint);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.endpoint);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const { success, error } = await webhooks.enroll(fake.endpoint);

    expect(error).toStrictEqual({ message: "Failed to enroll webhook.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
