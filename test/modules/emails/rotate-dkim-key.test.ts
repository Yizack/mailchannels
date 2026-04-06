import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Emails } from "~/modules/emails";
import { ErrorCode } from "~/utils/errors";
import type { EmailsRotateDkimKeyApiResponse } from "~/types/emails/internal";
import type { EmailsRotateDkimKeyResponse } from "~/types/emails/rotate-dkim-key";

const fake = {

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
};

describe("rotateDkimKey", () => {
  it("should successfully rotate a DKIM key", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should return error if selector is missing or more than 63 characters", async () => {
    const mockClient = { post: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "a".repeat(64), fake.options);

    expect(data).toBeNull();
    expect(error).toStrictEqual({ message: "Selector must be between 1 and 63 characters.", statusCode: null });
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
    expect(error).toStrictEqual({ message: "New key selector must be between 1 and 63 characters.", statusCode: null });
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
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { data, error } = await emails.rotateDkimKey("example.com", "mailchannels_test", fake.options);

    expect(error).toStrictEqual({ message: "Failed to rotate DKIM key.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
