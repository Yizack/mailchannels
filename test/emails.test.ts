import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Emails } from "../src/modules/emails";
import type { EmailsSendOptions } from "../src/types/emails/send";
import { Logger } from "../src/utils/logger";

const fake = {
  send: {
    options: {
      to: "recipient@example.com",
      from: "sender@example.com",
      subject: "Test Subject",
      html: "<p>Test content</p>",
      text: "Test content",
      tracking: { click: true, open: true }
    } as EmailsSendOptions,
    query: { "dry-run": false }
  },
  checkDomain: {
    apiResponse: {
      check_results: {
        spf: { verdict: "passed" },
        domain_lockdown: { verdict: "passed" },
        dkim: [{ dkim_domain: "example.com", dkim_selector: "selector", verdict: "passed" }]
      }
    },
    options: {
      dkim: { domain: "example.com", privateKey: "private-key", selector: "selector" },
      domain: "example.com",
      senderId: "sender-id"
    },
    payload: expect.objectContaining({
      dkim_settings: [{
        dkim_domain: "example.com",
        dkim_private_key: "private-key",
        dkim_selector: "selector"
      }],
      domain: "example.com",
      sender_id: "sender-id"
    })
  }
};

describe("send", () => {
  it("should successfully send an email", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const result = await emails.send(fake.send.options);

    expect(result).toEqual({ success: true });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should log an error when from field is missing", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    // @ts-expect-error Testing missing from error
    delete options.from;

    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await emails.send(options);

    expect(spyLogger).toHaveBeenCalledWith("No sender provided. Use the `from` option to specify a sender");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error when to field is missing", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    // @ts-expect-error Testing missing to error
    delete options.to;

    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await emails.send(options);

    expect(spyLogger).toHaveBeenCalledWith("No recipients provided. Use the `to` option to specify at least one recipient");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error when no content provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    delete options.html;
    delete options.text;

    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await emails.send(options);

    expect(spyLogger).toHaveBeenCalledWith("No email content provided");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should return success false when an error occurs", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const result = await emails.send(fake.send.options);

    expect(result.success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should log an error on api bad request", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 400 } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await emails.send(fake.send.options);

    expect(spyLogger).toHaveBeenCalledWith("Bad Request.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error ona api forbidden", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 403 } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await emails.send(fake.send.options);

    expect(spyLogger).toHaveBeenCalledWith("User does not have access to this feature.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api payload is too large", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: 413 } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { success } = await emails.send(fake.send.options);

    expect(spyLogger).toHaveBeenCalledWith("The total message size should not exceed 20MB. This includes the message itself, headers, and the combined size of any attachments.");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });
});

describe("checkDomain", () => {
  it("should successfully check a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.checkDomain.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { results } = await emails.checkDomain(fake.checkDomain.options);

    expect(results?.spf.verdict).toBe("passed");
    expect(results?.domainLockdown.verdict).toBe("passed");
    expect(results?.dkim[0]!.verdict).toBe("passed");
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should log an error on api bad request", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 400 } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { results } = await emails.checkDomain(fake.checkDomain.options);

    expect(spyLogger).toHaveBeenCalledWith("Bad Request.");
    expect(results).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api forbidden", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 403 } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { results } = await emails.checkDomain(fake.checkDomain.options);

    expect(spyLogger).toHaveBeenCalledWith("User does not have access to this feature.");
    expect(results).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });

  it("should log an error on api unknown error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 500 } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const spyLogger = vi.spyOn(Logger, "error");
    const { results } = await emails.checkDomain(fake.checkDomain.options);

    expect(spyLogger).toHaveBeenCalledWith("Unknown error.");
    expect(results).toBeUndefined();
    expect(mockClient.post).toHaveBeenCalled();
    spyLogger.mockRestore();
  });
});
