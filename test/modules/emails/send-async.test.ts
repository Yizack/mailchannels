import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Emails } from "~/modules/emails";
import type { EmailsSendOptions } from "~/types/emails/send";
import type { EmailsSendAsyncResponse } from "~/types/emails/send-async";
import { ErrorCode } from "~/utils/errors";
import type { EmailsSendAsyncApiResponse } from "~/types/emails/internal";

const fake = {
  options: {
    to: "recipient@example.com",
    from: "sender@example.com",
    subject: "Test Subject",
    html: "<p>Test content</p>",
    text: "Test content",
    tracking: { click: true, open: true }
  } satisfies EmailsSendOptions,
  apiResponse: {
    queued_at: "date-time-string",
    request_id: "test-async-request-id"
  } satisfies EmailsSendAsyncApiResponse,
  expectedResponse: {
    data: {
      queuedAt: "date-time-string",
      requestId: "test-async-request-id"
    },
    error: null
  } satisfies EmailsSendAsyncResponse
};

describe("sendAsync", () => {
  it("should successfully queue an email", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.sendAsync(fake.options);

    expect(error).toBeNull();
    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { error } = await emails.sendAsync(fake.options);

    expect(error).toBeTruthy();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { error } = await emails.sendAsync(fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { error } = await emails.sendAsync(fake.options);

    expect(error).toStrictEqual({ message: "Failed to queue email.", statusCode: null });
    expect(mockClient.post).toHaveBeenCalled();
  });
});
