import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Emails } from "../src/modules/emails";
import type { EmailsSendOptions, EmailsSendResponse } from "../src/types/emails/send";
import { ErrorCode } from "../src/utils/errors";
import type { EmailsCreateDkimKeyApiResponse, EmailsSendApiResponse } from "../src/types/emails/internal";
import type { EmailsCreateDkimKeyResponse } from "../src/types/emails/create-dkim-key";
import type { EmailsCheckDomainResponse } from "../src/types/emails/check-domain";

const fake = {
  send: {
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
  },
  checkDomain: {
    apiResponse: {
      check_results: {
        spf: { verdict: "passed" },
        domain_lockdown: { verdict: "passed" },
        sender_domain: { a: { verdict: "failed" }, mx: { verdict: "passed" }, verdict: "passed" },
        dkim: [{ dkim_domain: "example.com", dkim_key_status: "provided", dkim_selector: "selector", verdict: "passed" }]
      }
    },
    expectedResponse: {
      results: {
        spf: { verdict: "passed" },
        domainLockdown: { verdict: "passed" },
        senderDomain: { a: { verdict: "failed" }, mx: { verdict: "passed" }, verdict: "passed" },
        dkim: [{ domain: "example.com", keyStatus: "provided", selector: "selector", verdict: "passed" }]
      },
      error: null
    } satisfies EmailsCheckDomainResponse,
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
  },
  createDkimKey: {
    options: {
      selector: "mailchannels_test"
    },
    apiResponse: {
      algorithm: "rsa",
      created_at: "2024-07-29T15:51:28.071Z",
      dkim_dns_records: [{
        name: "mailchannels_test._domainkey.example.com",
        type: "TXT",
        value: "string"
      }],
      domain: "example.com",
      key_length: 2048,
      public_key: "string",
      selector: "mailchannels_test",
      status: "active",
      status_modified_at: "2024-07-29T15:51:28.071Z"
    } satisfies EmailsCreateDkimKeyApiResponse,
    expectedResponse: {
      key: {
        algorithm: "rsa",
        createdAt: "2024-07-29T15:51:28.071Z",
        dnsRecords: [{
          name: "mailchannels_test._domainkey.example.com",
          type: "TXT",
          value: "string"
        }],
        domain: "example.com",
        length: 2048,
        publicKey: "string",
        selector: "mailchannels_test",
        status: "active",
        statusModifiedAt: "2024-07-29T15:51:28.071Z"
      },
      error: null
    } as EmailsCreateDkimKeyResponse
  }
};

describe("send", () => {
  it("should successfully send an email", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
        return fake.send.apiResponse;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, data } = await emails.send(fake.send.options);

    expect(success).toBe(true);
    expect(data).toEqual(fake.send.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when from field is missing", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    // @ts-expect-error Testing missing from error
    delete options.from;

    const { success, error } = await emails.send(options);

    expect(error).toBe("No sender provided. Use the `from` option to specify a sender");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when to field is missing", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    // @ts-expect-error Testing missing to error
    delete options.to;

    const { success, error } = await emails.send(options);

    expect(error).toBe("No recipients provided. Use the `to` option to specify at least one recipient");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when no content provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    options.html = "";
    options.text = "";

    const { success, error } = await emails.send(options);

    expect(error).toBe("No email content provided");
    expect(success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
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

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.send.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("checkDomain", () => {
  it("should successfully check a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.checkDomain.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { results, error } = await emails.checkDomain(fake.checkDomain.options);

    expect(results).toEqual(fake.checkDomain.expectedResponse.results);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { results, error } = await emails.checkDomain(fake.checkDomain.options);

    expect(error).toBeTruthy();
    expect(results).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("createDkimKey", () => {
  it("should successfully create a DKIM key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.createDkimKey.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { key, error } = await emails.createDkimKey("example.com", fake.createDkimKey.options);

    expect(key).toEqual(fake.createDkimKey.expectedResponse.key);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { key, error } = await emails.createDkimKey("example.com", fake.createDkimKey.options);

    expect(error).toBeTruthy();
    expect(key).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should return error if selector is too long", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { key, error } = await emails.createDkimKey("example.com", { selector: "a".repeat(64) });

    expect(error).toBe("Selector must be between 1 and 63 characters.");
    expect(key).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });
});

describe("getDkimKeys", () => {
  it("should successfully get DKIM keys", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue({ keys: [fake.createDkimKey.apiResponse] })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { keys, error } = await emails.getDkimKeys("example.com", { includeDnsRecord: true });

    expect(keys).toEqual([fake.createDkimKey.expectedResponse.key]);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { keys, error } = await emails.getDkimKeys("example.com", { includeDnsRecord: true });

    expect(error).toBeTruthy();
    expect(keys).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should return error if selector is too long", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { keys, error } = await emails.getDkimKeys("example.com", { selector: "a".repeat(64) });

    expect(error).toBe("Selector must be a maximum of 63 characters.");
    expect(keys).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should return error if limit is out of range", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { keys, error } = await emails.getDkimKeys("example.com", { limit: 101 });

    expect(error).toBe("Limit must be between 1 and 100.");
    expect(keys).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should return error if offset is negative", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { keys, error } = await emails.getDkimKeys("example.com", { offset: -10 });

    expect(error).toBe("Offset value is invalid. Only positive values are allowed.");
    expect(keys).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });
});

describe("updateDkimKey", () => {
  it("should successfully update a DKIM key", async () => {
    const mockClient = {
      patch: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels_test",
      status: "retired"
    });

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.patch).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      patch: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels_test",
      status: "retired"
    });

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.patch).toHaveBeenCalled();
  });

  it("should return error if selector is missing or more than 63 characters", async () => {
    const mockClient = { patch: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "a".repeat(64),
      status: "retired"
    });

    expect(success).toBe(false);
    expect(error).toBe("Selector must be between 1 and 63 characters.");
    expect(mockClient.patch).not.toHaveBeenCalled();
  });
});
