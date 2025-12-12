import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Emails } from "../src/modules/emails";
import type { EmailsSendOptions, EmailsSendResponse } from "../src/types/emails/send";
import { ErrorCode } from "../src/utils/errors";
import type { EmailsCreateDkimKeyApiResponse, EmailsRotateDkimKeyApiResponse, EmailsSendApiResponse } from "../src/types/emails/internal";
import type { EmailsCreateDkimKeyResponse } from "../src/types/emails/create-dkim-key";
import type { EmailsCheckDomainResponse } from "../src/types/emails/check-domain";
import type { EmailsRotateDkimKeyResponse } from "../src/types/emails/rotate-dkim-key";

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
      data: {
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
      data: {
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
    } satisfies EmailsCreateDkimKeyResponse
  },
  rotateDkimKey: {
    options: {
      newKey: {
        selector: "mc_test"
      }
    },
    apiResponse: {
      new_key: {
        algorithm: "rsa",
        dkim_dns_records: [
          {
            name: "mc_test._domainkey.example.com",
            type: "TXT",
            value: "string"
          }
        ],
        domain: "example.com",
        key_length: 2048,
        public_key: "string",
        selector: "mc_test",
        status: "active"
      },
      rotated_key: {
        algorithm: "rsa",
        created_at: "2025-09-17T16:31:20Z",
        dkim_dns_records: [
          {
            name: "mailchannels_test._domainkey.example.com",
            type: "TXT",
            value: "string"
          }
        ],
        domain: "example.com",
        gracePeriodExpiresAt: "2025-12-05T01:47:11.311Z",
        key_length: 2048,
        public_key: "string",
        retiresAt: "2025-12-16T01:47:11.311Z",
        selector: "mailchannels_test",
        status: "rotated",
        status_modified_at: "2025-12-02T01:47:11.311Z"
      }
    } satisfies EmailsRotateDkimKeyApiResponse,
    expectedResponse: {
      data: {
        new: {
          algorithm: "rsa",
          dnsRecords: [
            {
              name: "mc_test._domainkey.example.com",
              type: "TXT",
              value: "string"
            }
          ],
          domain: "example.com",
          length: 2048,
          publicKey: "string",
          selector: "mc_test",
          status: "active"
        },
        rotated: {
          algorithm: "rsa",
          createdAt: "2025-09-17T16:31:20Z",
          dnsRecords: [
            {
              name: "mailchannels_test._domainkey.example.com",
              type: "TXT",
              value: "string"
            }
          ],
          domain: "example.com",
          gracePeriodExpiresAt: "2025-12-05T01:47:11.311Z",
          length: 2048,
          publicKey: "string",
          retiresAt: "2025-12-16T01:47:11.311Z",
          selector: "mailchannels_test",
          status: "rotated",
          statusModifiedAt: "2025-12-02T01:47:11.311Z"
        }
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
    expect(data).toStrictEqual(fake.send.expectedResponse.data);
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

  it("should successfully send an email with trackings disabled", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
        return fake.send.apiResponse;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send({
      ...fake.send.options,
      tracking: {
        click: false,
        open: false
      }
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toStrictEqual(fake.send.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully send an email with no tracking", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
        return fake.send.apiResponse;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, data, error } = await emails.send({
      ...fake.send.options,
      tracking: undefined
    });

    expect(error).toBeNull();
    expect(success).toBe(true);
    expect(data).toStrictEqual(fake.send.expectedResponse.data);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.send.options);

    expect(error).toBe("failure");
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.send(fake.send.options);

    expect(error).toBe("Failed to send email.");
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
    const { data, error } = await emails.checkDomain(fake.checkDomain.options);

    expect(data).toStrictEqual(fake.checkDomain.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(fake.checkDomain.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(fake.checkDomain.options);

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(fake.checkDomain.options);

    expect(error).toBe("Failed to check domain.");
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("createDkimKey", () => {
  it("should successfully create a DKIM key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.createDkimKey.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.createDkimKey("example.com", fake.createDkimKey.options);

    expect(data).toStrictEqual(fake.createDkimKey.expectedResponse.data);
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

    const emails = new Emails(mockClient);
    const { data, error } = await emails.createDkimKey("example.com", fake.createDkimKey.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should return error if selector is too long", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.createDkimKey("example.com", { selector: "a".repeat(64) });

    expect(error).toBe("Selector must be between 1 and 63 characters.");
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should return error if no selector is provided", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.createDkimKey("example.com", { selector: "" });

    expect(error).toBe("Selector must be between 1 and 63 characters.");
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.createDkimKey("example.com", fake.createDkimKey.options);

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.createDkimKey("example.com", fake.createDkimKey.options);

    expect(error).toBe("Failed to create DKIM key.");
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("getDkimKeys", () => {
  it("should successfully get DKIM keys", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue({ keys: [fake.createDkimKey.apiResponse] })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { includeDnsRecord: true });

    expect(data).toStrictEqual([fake.createDkimKey.expectedResponse.data]);
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

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { includeDnsRecord: true });

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should return error if selector is too long", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { selector: "a".repeat(64) });

    expect(error).toBe("Selector must be between 1 and 63 characters.");
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should return error if limit is out of range", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { limit: 101 });

    expect(error).toBe("The limit value must be between 1 and 100.");
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should return error if offset is negative", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { offset: -10 });

    expect(error).toBe("Offset must be greater than or equal to 0.");
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com");

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com");

    expect(error).toBe("Failed to fetch DKIM keys.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
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

  it("should handle catch block errors", async () => {
    const mockClient = {
      patch: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels",
      status: "retired"
    });

    expect(error).toBe("failure");
    expect(success).toBe(false);
    expect(mockClient.patch).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      patch: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels",
      status: "retired"
    });

    expect(error).toBe("Failed to update DKIM key.");
    expect(success).toBe(false);
    expect(mockClient.patch).toHaveBeenCalled();
  });
});

describe("rotateDkimKey", () => {
  it("should successfully rotate a DKIM key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.rotateDkimKey.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.rotateDkimKey.options);

    expect(data).toStrictEqual(fake.rotateDkimKey.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should return error if selector is missing or more than 63 characters", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "a".repeat(64), fake.rotateDkimKey.options);

    expect(data).toBeNull();
    expect(error).toBe("Selector must be between 1 and 63 characters.");
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should return error if new selector is missing or more than 63 characters", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", {
      newKey: {
        selector: "a".repeat(64)
      }
    });

    expect(data).toBeNull();
    expect(error).toBe("New key selector must be between 1 and 63 characters.");
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.rotateDkimKey.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.rotateDkimKey.options);

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.rotateDkimKey.options);

    expect(error).toBe("Failed to rotate DKIM key.");
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
