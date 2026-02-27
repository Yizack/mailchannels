import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Emails } from "~/modules/emails";
import type { EmailsSendOptions, EmailsSendResponse } from "~/types/emails/send";
import { ErrorCode } from "~/utils/errors";
import type { EmailsSendApiResponse } from "~/types/emails/internal";

const fake = {
  options: {
    to: "recipient@example.com",
    from: "sender@example.com",
    subject: "Test Subject",
    html: "<p>Test content</p>",
    text: "Test content",
    tracking: { click: true, open: true }
  } satisfies EmailsSendOptions,
  query: { "dry-run": false },
  apiResponse: {
    request_id: "test-request-id",
    results: [{
      message_id: "test-message-id",
      status: "sent"
    }]
  } satisfies EmailsSendApiResponse,
  expectedResponse: {
    success: true,
    data: {
      requestId: "test-request-id",
      results: [{
        messageId: "test-message-id",
        status: "sent"
      }]
    },
    error: null
  } satisfies EmailsSendResponse

};

describe("send", () => {
  it("should successfully send an email", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send(fake.options);

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with only text content", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    // @ts-expect-error testing without html content
    delete fake.options.html;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send(fake.options);

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when from field is missing", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.options };
    // @ts-expect-error Testing missing from error
    delete options.from;

    const { success, error } = await emails.send(options);

    expect(error).toStrictEqual({ message: "No sender provided. Use the `from` option to specify a sender", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when to field is missing", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.options };
    // @ts-expect-error Testing missing to error
    delete options.to;

    const { success, error } = await emails.send(options);

    expect(error).toStrictEqual({ message: "No recipients provided. Use the `to` option to specify at least one recipient", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when no content provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.options };
    options.html = "";
    options.text = "";

    const { success, error } = await emails.send(options);

    expect(error).toStrictEqual({ message: "No email content provided", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should return success false when an error occurs", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
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
    const { success, error } = await emails.send(fake.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with trackings disabled", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send({
      ...fake.options,
      tracking: {
        click: false,
        open: false
      }
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with no tracking", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send({
      ...fake.options,
      tracking: undefined
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.options);

    expect(error).toStrictEqual({ message: "Failed to send email.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
