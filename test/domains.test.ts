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

describe("delete", () => {
  it("should successfully delete a provisioned domain", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success } = await domains.delete(fake.provision.domain);

    expect(mockClient.delete).toHaveBeenCalled();
    expect(success).toBe(true);
  });

  it("should contain error if domain is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.delete("");

    expect(error).toBe("No domain provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.delete(fake.provision.domain);

    expect(error).toBeDefined();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
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

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { entry, error } = await domains.addListEntry("", fake.addListEntry.options);

    expect(error).toBe("No domain provided.");
    expect(entry).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
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

    expect(error).toBe("No domain provided.");
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

describe("updateApiKey", () => {
  it("should successfully update an api key", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success } = await domains.updateApiKey(fake.provision.domain, "new-api-key");

    expect(success).toBe(true);
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.updateApiKey("", "new-api-key");

    expect(error).toBe("No domain provided.");
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error when api key is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.updateApiKey(fake.provision.domain, "");

    expect(error).toBe("No API key provided.");
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false, status: ErrorCode.Forbidden } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.updateApiKey(fake.provision.domain, "new-api-key");

    expect(error).toBeDefined();
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });
});
