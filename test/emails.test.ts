import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Emails } from "../src/modules/emails";
import type { EmailsSendOptions, EmailsSendResponse } from "../src/types/emails/send";
import type { EmailsSendAsyncResponse } from "../src/types/emails/send-async";
import type { EmailsCheckDomainResponse } from "../src/types/emails/check-domain";
import type { EmailsCreateDkimKeyResponse } from "../src/types/emails/create-dkim-key";
import type { EmailsRotateDkimKeyResponse } from "../src/types/emails/rotate-dkim-key";
import type { EmailsCreateDkimKeyApiResponse, EmailsRotateDkimKeyApiResponse, EmailsSendApiResponse, EmailsSendAsyncApiResponse } from "../src/types/emails/internal";
import { ErrorCode } from "../src/utils/errors";

const sendPayload = {
  attachments: undefined,
  campaign_id: undefined,
  content: [
    { type: "text/plain", value: "Test content", template_type: undefined },
    { type: "text/html", value: "<p>Test content</p>", template_type: undefined }
  ],
  from: { email: "sender@example.com" },
  headers: undefined,
  personalizations: [{
    bcc: undefined,
    cc: undefined,
    dkim_domain: undefined,
    dkim_private_key: undefined,
    dkim_selector: undefined,
    dynamic_template_data: undefined,
    to: [{ email: "recipient@example.com" }]
  }],
  reply_to: undefined,
  subject: "Test Subject",
  tracking_settings: {
    click_tracking: { enable: true },
    open_tracking: { enable: true }
  },
  transactional: undefined
};

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
    payload: sendPayload,
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
  sendAsync: {
    apiResponse: {
      queued_at: "2026-04-04T12:00:00.000Z",
      request_id: "queued-request-id"
    } satisfies EmailsSendAsyncApiResponse,
    expectedResponse: {
      success: true,
      data: {
        queuedAt: "2026-04-04T12:00:00.000Z",
        requestId: "queued-request-id"
      },
      error: null
    } satisfies EmailsSendAsyncResponse
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
        gracePeriodExpiresAt: null,
        length: 2048,
        publicKey: "string",
        retiresAt: null,
        selector: "mailchannels_test",
        status: "active",
        statusModifiedAt: "2024-07-29T15:51:28.071Z"
      },
      error: null
    } as EmailsCreateDkimKeyResponse
  },
  rotateDkimKey: {
    options: {
      selector: "mailchannels_test",
      newSelector: "mailchannels_next"
    },
    apiResponse: {
      new_key: {
        algorithm: "rsa",
        created_at: "2026-04-04T12:00:00.000Z",
        dkim_dns_records: [{
          name: "mailchannels_next._domainkey.example.com",
          type: "TXT",
          value: "new-value"
        }],
        domain: "example.com",
        key_length: 2048,
        public_key: "new-public-key",
        selector: "mailchannels_next",
        status: "active",
        status_modified_at: "2026-04-04T12:00:00.000Z"
      },
      rotated_key: {
        algorithm: "rsa",
        created_at: "2024-07-29T15:51:28.071Z",
        dkim_dns_records: [{
          name: "mailchannels_test._domainkey.example.com",
          type: "TXT",
          value: "old-value"
        }],
        domain: "example.com",
        gracePeriodExpiresAt: "2026-04-07T12:00:00.000Z",
        key_length: 2048,
        public_key: "old-public-key",
        retiresAt: "2026-04-18T12:00:00.000Z",
        selector: "mailchannels_test",
        status: "rotated",
        status_modified_at: "2026-04-04T12:00:00.000Z"
      }
    } satisfies EmailsRotateDkimKeyApiResponse,
    expectedResponse: {
      newKey: {
        algorithm: "rsa",
        createdAt: "2026-04-04T12:00:00.000Z",
        dnsRecords: [{
          name: "mailchannels_next._domainkey.example.com",
          type: "TXT",
          value: "new-value"
        }],
        domain: "example.com",
        gracePeriodExpiresAt: null,
        length: 2048,
        publicKey: "new-public-key",
        retiresAt: null,
        selector: "mailchannels_next",
        status: "active",
        statusModifiedAt: "2026-04-04T12:00:00.000Z"
      },
      rotatedKey: {
        algorithm: "rsa",
        createdAt: "2024-07-29T15:51:28.071Z",
        dnsRecords: [{
          name: "mailchannels_test._domainkey.example.com",
          type: "TXT",
          value: "old-value"
        }],
        domain: "example.com",
        gracePeriodExpiresAt: "2026-04-07T12:00:00.000Z",
        length: 2048,
        publicKey: "old-public-key",
        retiresAt: "2026-04-18T12:00:00.000Z",
        selector: "mailchannels_test",
        status: "rotated",
        statusModifiedAt: "2026-04-04T12:00:00.000Z"
      },
      error: null
    } satisfies EmailsRotateDkimKeyResponse
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
    const { success, data, error } = await emails.send(fake.send.options);

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toEqual(fake.send.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/send", expect.objectContaining({
      query: fake.send.query,
      body: fake.send.payload,
      onResponse: expect.any(Function)
    }));
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
    const { success, error } = await emails.send(fake.send.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => new Promise((_, reject) => {
        onResponse({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.send.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should include disabled tracking values in the payload", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
        return fake.send.apiResponse;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    await emails.send({
      ...fake.send.options,
      tracking: {
        click: false,
        open: false
      }
    });

    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/send", expect.objectContaining({
      body: expect.objectContaining({
        tracking_settings: {
          click_tracking: { enable: false },
          open_tracking: { enable: false }
        }
      })
    }));
  });

  it("should omit tracking settings when tracking is not provided", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
        return fake.send.apiResponse;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    await emails.send({
      ...fake.send.options,
      tracking: undefined
    });

    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/send", expect.objectContaining({
      body: expect.objectContaining({
        tracking_settings: undefined
      })
    }));
  });
});

describe("sendAsync", () => {
  it("should successfully queue an email", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
        return fake.sendAsync.apiResponse;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const result = await emails.sendAsync(fake.send.options);

    expect(result).toEqual(fake.sendAsync.expectedResponse);
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/send-async", expect.objectContaining({
      body: fake.send.payload,
      onResponse: expect.any(Function)
    }));
  });

  it("should return validation errors before calling the api", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const result = await emails.sendAsync({
      ...fake.send.options,
      text: "",
      html: ""
    });

    expect(result.error).toBe("No email content provided");
    expect(result.success).toBe(false);
    expect(mockClient.post).not.toHaveBeenCalled();
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
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/check-domain", expect.objectContaining({
      body: fake.checkDomain.payload
    }));
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
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
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/domains/example.com/dkim-keys", expect.objectContaining({
      body: {
        algorithm: undefined,
        key_length: undefined,
        selector: "mailchannels_test"
      }
    }));
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
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
    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/domains/example.com/dkim-keys", expect.objectContaining({
      query: {
        selector: undefined,
        status: undefined,
        offset: undefined,
        limit: undefined,
        include_dns_record: true
      }
    }));
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
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

describe("rotateDkimKey", () => {
  it("should successfully rotate a DKIM key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.rotateDkimKey.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const result = await emails.rotateDkimKey("example.com", fake.rotateDkimKey.options);

    expect(result).toEqual(fake.rotateDkimKey.expectedResponse);
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/domains/example.com/dkim-keys/mailchannels_test/rotate", expect.objectContaining({
      body: {
        new_key: {
          selector: "mailchannels_next"
        }
      }
    }));
  });

  it("should return error if selector is too long", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const result = await emails.rotateDkimKey("example.com", {
      selector: "a".repeat(64),
      newSelector: "mailchannels-next"
    });

    expect(result.error).toBe("Selector must be between 1 and 63 characters.");
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should return error if new selector is too long", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);

    const result = await emails.rotateDkimKey("example.com", {
      selector: "mailchannels",
      newSelector: "a".repeat(64)
    });

    expect(result.error).toBe("New selector must be between 1 and 63 characters.");
    expect(mockClient.post).not.toHaveBeenCalled();
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
      status: "rotated"
    });

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.patch).toHaveBeenCalledWith("/tx/v1/domains/example.com/dkim-keys/mailchannels_test", expect.objectContaining({
      body: {
        status: "rotated"
      }
    }));
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
