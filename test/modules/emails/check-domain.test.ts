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
