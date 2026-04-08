import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Emails } from "~/modules/emails";
import { ErrorCode } from "~/utils/errors";
import type { EmailsCheckDomainResponse } from "~/types/emails/check-domain";

const fake = {
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
};

describe("checkDomain", () => {
  it("should successfully check a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully check a domain with dkim as array", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain({
      ...fake.options,
      dkim: [fake.options.dkim]
    });

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully check a domain without dkim settings", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const options = { ...fake.options };
    // @ts-expect-error testing without dkim settings
    delete options.dkim;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should successfully check a domain with dkim without private key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const options = { ...fake.options };
    // @ts-expect-error testing dkim without private key
    delete options.dkim.privateKey;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when dkim settings exceed 10", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain({
      ...fake.options,
      dkim: Array.from({ length: 11 }, () => ({ domain: "example.com", selector: "mailchannels" }))
    });

    expect(error).toStrictEqual({ message: "A maximum of 10 DKIM settings can be provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when dkim setting has privateKey without selector", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;
    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain({
      ...fake.options,
      dkim: [{ domain: "example.com", privateKey: "private-key" }]
    });

    expect(error).toStrictEqual({ message: "DKIM settings with a privateKey must also include a selector.", statusCode: null });
    expect(data).toBeNull();
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
    const { data, error } = await emails.checkDomain(fake.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.checkDomain(fake.options);

    expect(error).toStrictEqual({ message: "Failed to check domain.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
