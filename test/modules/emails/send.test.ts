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

    const options = { ...fake.options };
    // @ts-expect-error testing without html content
    delete options.html;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send(options);

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

  it("should successfully send an email with mustaches template", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      mustaches: { name: "World" }
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with dkim private key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      dkim: { domain: "example.com", privateKey: "private-key", selector: "mailchannels" }
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when attachments exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      attachments: Array.from({ length: 1001 }, () => ({ content: "data", filename: "file.txt", type: "text/plain" }))
    });

    expect(error).toStrictEqual({ message: "The maximum number of attachments is 1000.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when campaignId exceeds 48 characters", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      campaignId: "a".repeat(49)
    });

    expect(error).toStrictEqual({ message: "campaignId must be 48 characters or fewer and must not contain spaces.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when campaignId contains spaces", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      campaignId: "has space"
    });

    expect(error).toStrictEqual({ message: "campaignId must be 48 characters or fewer and must not contain spaces.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when headers includes a reserved header name", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      headers: { from: "test@example.com" }
    });

    expect(error).toStrictEqual({ message: "Root headers cannot include the reserved header 'from'.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when headers has duplicate keys case-insensitively", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      headers: { "X-Custom": "value1", "x-custom": "value2" }
    });

    expect(error).toStrictEqual({ message: "Root headers must be unique when compared case-insensitively.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when headers has non-string value", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      // @ts-expect-error Testing non-string header value
      headers: { "x-custom": 123 }
    });

    expect(error).toStrictEqual({ message: "Root header 'x-custom' must have a string value.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when dkim has domain without selector", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      dkim: { domain: "example.com" }
    });

    expect(error).toStrictEqual({ message: "Root DKIM domain requires a selector.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when dkim has privateKey without domain", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      dkim: { privateKey: "private-key" }
    });

    expect(error).toStrictEqual({ message: "Root DKIM privateKey requires both a domain and selector.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when to recipients exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      to: Array.from({ length: 1001 }, (_, i) => `to${i}@example.com`)
    });

    expect(error).toStrictEqual({ message: "The maximum number of `to` recipients is 1000.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when cc recipients exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      cc: Array.from({ length: 1001 }, (_, i) => `cc${i}@example.com`)
    });

    expect(error).toStrictEqual({ message: "The maximum number of `cc` recipients is 1000.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when bcc recipients exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      bcc: Array.from({ length: 1001 }, (_, i) => `bcc${i}@example.com`)
    });

    expect(error).toStrictEqual({ message: "The maximum number of `bcc` recipients is 1000.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when transactional is false without DKIM", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      transactional: false
    });

    expect(error).toStrictEqual({ message: "Non-transactional messages must be DKIM signed.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when transactional is false with multiple recipients", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      to: ["recipient1@example.com", "recipient2@example.com"],
      dkim: { domain: "example.com", selector: "mailchannels" },
      transactional: false
    });

    expect(error).toStrictEqual({ message: "Non-transactional messages must have exactly one recipient per personalization.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should successfully send a non-transactional email", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      to: "recipient@example.com",
      dkim: { domain: "example.com", selector: "mailchannels" },
      transactional: false
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with valid custom headers", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      headers: { "x-custom-header": "value" }
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with tracking object but no click or open defined", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { success, error } = await emails.send({
      ...fake.options,
      tracking: {}
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when personalizations is empty", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: []
    });

    expect(error).toStrictEqual({ message: "At least one personalization must be provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalizations exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: Array.from({ length: 1001 }, () => ({ to: "recipient@example.com" }))
    });

    expect(error).toStrictEqual({ message: "The maximum number of personalizations is 1000.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalization has no to recipients", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{ to: "" }]
    });

    expect(error).toStrictEqual({ message: "Personalization at index 0 must include at least one recipient in the `to` field.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalization to recipients exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{
        to: Array.from({ length: 1001 }, (_, i) => `to${i}@example.com`)
      }]
    });

    expect(error).toStrictEqual({ message: "Personalization at index 0 cannot include more than 1000 `to` recipients.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalization cc recipients exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{
        to: "recipient@example.com",
        cc: Array.from({ length: 1001 }, (_, i) => `cc${i}@example.com`)
      }]
    });

    expect(error).toStrictEqual({ message: "Personalization at index 0 cannot include more than 1000 `cc` recipients.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalization bcc recipients exceed 1000", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{
        to: "recipient@example.com",
        bcc: Array.from({ length: 1001 }, (_, i) => `bcc${i}@example.com`)
      }]
    });

    expect(error).toStrictEqual({ message: "Personalization at index 0 cannot include more than 1000 `bcc` recipients.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalization headers include a reserved header", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{
        to: "recipient@example.com",
        headers: { from: "test@example.com" }
      }]
    });

    expect(error).toStrictEqual({ message: "Personalization at index 0 headers cannot include the reserved header 'from'.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when personalization dkim has domain without selector", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{
        to: "recipient@example.com",
        dkim: { domain: "example.com" }
      }]
    });

    expect(error).toStrictEqual({ message: "Personalization at index 0 DKIM domain requires a selector.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should successfully send an email with personalizations and mustaches template", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { from, subject, html, text, tracking } = fake.options;
    const { success, error } = await emails.send({
      from,
      subject,
      html,
      text,
      tracking,
      personalizations: [{
        to: "recipient@example.com",
        mustaches: { name: "World" }
      }]
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
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
