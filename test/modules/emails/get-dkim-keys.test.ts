import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Emails } from "~/modules/emails";
import { ErrorCode } from "~/utils/errors";
import type { EmailsCreateDkimKeyApiResponse } from "~/types/emails/internal";
import type { EmailsCreateDkimKeyResponse } from "~/types/emails/create-dkim-key";

const fake = {
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
};

describe("getDkimKeys", () => {
  it("should successfully get DKIM keys", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce({ keys: [fake.apiResponse] })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { includeDnsRecord: true });

    expect(data).toStrictEqual([fake.expectedResponse.data]);
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

    expect(error).toStrictEqual({ message: "Selector must be between 1 and 63 characters.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should return error if limit is out of range", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { limit: 101 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 100.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should return error if offset is negative", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com", { offset: -10 });

    expect(error).toStrictEqual({ message: "Offset must be greater than or equal to 0.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com");

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.getDkimKeys("example.com");

    expect(error).toStrictEqual({ message: "Failed to fetch DKIM keys.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
