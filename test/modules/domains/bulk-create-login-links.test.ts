import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Domains } from "~/modules/domains";
import { ErrorCode } from "~/utils/errors";
import type { DomainsBulkCreateLoginLinksResponse } from "~/types/domains/bulk-create-login-links";

const fake = {
  apiResponse: {
    successes: [
      {
        domain: "example1.com",
        code: 200,
        comment: "string",
        loginLink: "string"
      }
    ],
    errors: [
      {
        domain: "example2.com",
        code: 400,
        comment: "string"
      }
    ]
  } satisfies DomainsBulkCreateLoginLinksResponse["data"]
};

describe("bulkCreateLoginLinks", () => {
  it("should successfully bulk create login links", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkCreateLoginLinks([
      "example1.com",
      "example2.com"
    ]);

    expect(data).toStrictEqual(fake.apiResponse);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error if no domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkCreateLoginLinks([]);

    expect(error).toStrictEqual({ message: "No domains provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error more than 1000 domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkCreateLoginLinks(new Array(1001).fill("example.com"));

    expect(error).toStrictEqual({ message: "The maximum number of domains to create login links for is 1000.", statusCode: null });
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

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkCreateLoginLinks([
      "example1.com",
      "example2.com"
    ]);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkCreateLoginLinks([
      "example1.com",
      "example2.com"
    ]);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkCreateLoginLinks([
      "example1.com",
      "example2.com"
    ]);

    expect(error).toStrictEqual({ message: "Failed to create login links.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
