import { expect, it, vi, describe } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Emails } from "../src/modules/emails";
import type { EmailsSendOptions } from "../src/types/emails/send";

const fake = {
  send: {
    apiResponse: { data: ["mock data"] },
    options: {
      to: "recipient@example.com",
      from: "sender@example.com",
      subject: "Test Subject",
      html: "<p>Test content</p>",
      text: "Test content"
    },
    query: { "dry-run": false },
    payload: expect.objectContaining({
      from: { email: "sender@example.com" },
      subject: "Test Subject",
      content: [
        { type: "text/plain", value: "Test content" },
        { type: "text/html", value: "<p>Test content</p>" }
      ],
      personalizations: expect.arrayContaining([
        expect.objectContaining({
          to: [{ email: "recipient@example.com" }]
        })
      ])
    })
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

describe("Emails", () => {
  it("should successfully send an email with required fields", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.send.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const result = await emails.send(fake.send.options, fake.send.query["dry-run"]);

    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/send", expect.objectContaining({
      query: fake.send.query,
      body: fake.send.payload
    }));

    expect(result).toEqual({
      success: true,
      payload: expect.any(Object),
      data: ["mock data"]
    });
  });


  it("should throw an error when from field is missing", async () => {
    const mockClient = {} as MailChannelsClient;
    const emails = new Emails(mockClient);

    const emailOptions = {
      to: "recipient@example.com",
      subject: "Test Subject",
      html: "<p>Test content</p>"
    } as EmailsSendOptions;

    await expect(emails.send(emailOptions)).rejects.toThrow(
      "No MailChannels sender provided. Use the `from` option to specify a sender"
    );
  });

  it("should check a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.checkDomain.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { results } = await emails.checkDomain(fake.checkDomain.options);

    expect(results.spf.verdict).toBe("passed");
    expect(results.domainLockdown.verdict).toBe("passed");
    expect(results.dkim[0].verdict).toBe("passed");
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/check-domain", expect.objectContaining({
      body: fake.checkDomain.payload
    }));
  });
});
