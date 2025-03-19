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
      text: "Test content",
      tracking: { click: true, open: true }
    } as EmailsSendOptions,
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
      ]),
      tracking_settings: expect.objectContaining({
        click_tracking: { enable: true },
        open_tracking: { enable: true }
      })
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

describe("send", () => {
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
      data: ["mock data"]
    });
  });


  it("should throw an error when from field is missing", async () => {
    const mockClient = {} as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    // @ts-expect-error Testing missing from error
    delete options.from;

    await expect(emails.send(options)).rejects.toThrow(
      "No sender provided. Use the `from` option to specify a sender"
    );
  });

  it("should throw an error when to field is missing", async () => {
    const mockClient = {} as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    // @ts-expect-error Testing missing to error
    delete options.to;

    await expect(emails.send(options)).rejects.toThrow(
      "No recipients provided. Use the `to` option to specify at least one recipient"
    );
  });

  it("should throw an error when no content provided", async () => {
    const mockClient = {} as MailChannelsClient;
    const emails = new Emails(mockClient);

    const options = { ...fake.send.options };
    delete options.html;
    delete options.text;

    await expect(emails.send(options)).rejects.toThrow(
      "No email content provided"
    );
  });

  it("should return success false when an error occurs", async () => {
    const mockClient = {
      post: vi.fn().mockImplementation(async (url, { onResponseError }) => {
        onResponseError();
        return null;
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const result = await emails.send(fake.send.options);

    expect(result.success).toBe(false);
  });
});


describe("checkDomain", () => {
  it("should successfully check a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(fake.checkDomain.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { results } = await emails.checkDomain(fake.checkDomain.options);

    expect(results.spf.verdict).toBe("passed");
    expect(results.domainLockdown.verdict).toBe("passed");
    expect(results.dkim[0]!.verdict).toBe("passed");
    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/check-domain", expect.objectContaining({
      body: fake.checkDomain.payload
    }));
  });
});
