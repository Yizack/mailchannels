import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Domains } from "~/modules/domains";
import { ErrorCode } from "~/utils/errors";
import type { DomainsBulkProvisionResponse } from "~/types/domains/provision";

const fake = {
  domain: "example.com",
  subscriptionHandle: "subscription-handle",
  apiResponse: {
    errors: [
      {
        code: 409,
        domain: {
          admins: null,
          aliases: null,
          domain: "example.com",
          downstreamAddresses: null,
          subscriptionHandle: "test"
        }
      }
    ],
    successes: [
      {
        code: 201,
        domain: {
          admins: [
            "support@example.com"
          ],
          aliases: null,
          domain: "example.com",
          downstreamAddresses: [],
          subscriptionHandle: "test"
        }
      }
    ]
  } satisfies DomainsBulkProvisionResponse["data"]
};

describe("bulkProvision", () => {
  it("should successfully bulk provision domains", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkProvision({ subscriptionHandle: fake.subscriptionHandle }, [
      { domain: fake.domain },
      { domain: fake.domain }
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
    const { data, error } = await domains.bulkProvision({ subscriptionHandle: fake.subscriptionHandle }, []);

    expect(error).toStrictEqual({ message: "No domains provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error more than 1000 domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkProvision({ subscriptionHandle: fake.subscriptionHandle }, new Array(1001).fill({ domain: fake.domain }));

    expect(error).toStrictEqual({ message: "The maximum number of domains to be provisioned is 1000.", statusCode: null });
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
    const { data, error } = await domains.bulkProvision({ subscriptionHandle: fake.subscriptionHandle }, [
      { domain: fake.domain },
      { domain: fake.domain }
    ]);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkProvision({ subscriptionHandle: fake.subscriptionHandle }, [{ domain: fake.domain }]);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.bulkProvision({ subscriptionHandle: fake.subscriptionHandle }, [{ domain: fake.domain }]);

    expect(error).toStrictEqual({ message: "Failed to provision domains.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
