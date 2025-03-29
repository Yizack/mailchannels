import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Domains } from "../src/modules/domains";
import type { DomainsProvisionOptions, DomainsProvisionResponse } from "../src/types/domains/provision";
import { ErrorCode } from "../src/utils/errors";
import type { DomainsAddListEntryOptions, DomainsAddListEntryResponse } from "../src/types/domains/add-list-entry";

const fake = {
  provision: {
    domain: "example.com",
    subscriptionHandle: "subscription-handle"
  } as DomainsProvisionOptions,
  loginLink: "https://example.com/login",
  list: [
    {
      admins: [
        "name@example.com"
      ],
      aliases: null,
      domain: "example.com",
      downstreamAddresses: [
        {
          port: 25,
          priority: 10,
          target: "example.com",
          weight: 10
        }
      ],
      settings: {
        abusePolicy: "quarantine",
        abusePolicyOverride: false,
        spamHeaderName: "X-Spam-Flag",
        spamHeaderValue: "YES"
      },
      subscriptionHandle: "your-subscription-handle"
    }
  ] as Partial<DomainsProvisionOptions>,
  addListEntry: {
    options: {
      listName: "safelist",
      item: "name@example.com"
    } as DomainsAddListEntryOptions,
    apiResponse: {
      action: "safelist",
      item: "name@example.com",
      item_type: "email_address"
    } as DomainsAddListEntryResponse["entry"]
  }
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

describe("list", () => {
  it("should successfully list domains", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce({ domains: fake.list, total: 1 })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { domains: domainsList } = await domains.list();

    expect(domainsList).toEqual(fake.list);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { domains: domainsList, error } = await domains.list({ limit: 5001 });

    expect(error).toBe("The limit value is invalid. Possible limit values are 1 to 5000.");
    expect(domainsList).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { domains: domainsList, error } = await domains.list({ offset: -1 });

    expect(error).toBe("Offset must be greater than or equal to 0.");
    expect(domainsList).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { domains: domainsList, error } = await domains.list();

    expect(error).toBeDefined();
    expect(domainsList).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("addListEntry", () => {
  it("should successfully add a list entry", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.addListEntry.apiResponse)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { entry } = await domains.addListEntry(fake.provision.domain, fake.addListEntry.options);

    expect(entry).toBe(fake.addListEntry.apiResponse);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { entry, error } = await domains.addListEntry(fake.provision.domain, fake.addListEntry.options);

    expect(error).toBeDefined();
    expect(entry).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("createLoginLink", () => {
  it("should successfully create a login link", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce({ loginLink: fake.loginLink })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { link } = await domains.createLoginLink(fake.provision.domain);

    expect(link).toBe(fake.loginLink);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { link, error } = await domains.createLoginLink("");

    expect(error).toBe("The domain is required.");
    expect(link).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Unauthorized } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { link, error } = await domains.createLoginLink(fake.provision.domain);

    expect(error).toBeDefined();
    expect(link).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
