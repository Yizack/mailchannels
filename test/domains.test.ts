import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Domains } from "../src/modules/domains";
import type { DomainsProvisionOptions } from "../src/types/domains/provision";
import { ErrorCode } from "../src/utils/errors";

const fake = {
  provision: {
    domain: "example.com",
    subscriptionHandle: "subscription-handle"
  } as DomainsProvisionOptions
};

describe("provision", () => {
  it("should successfully provision a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.provision)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data } = await domains.provision(fake.provision);

    expect(data).toBe(fake.provision);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.provision(fake.provision);

    expect(error).toBeDefined();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
