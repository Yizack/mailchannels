import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Domains } from "../src/modules/domains";
import type { DomainsProvisionOptions } from "../src/types/domains/provision";

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

  it("should contain error on api bad request", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false, status: 400 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.provision(fake.provision);

    expect(data).toBeNull();
    expect(error).toBeDefined();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
