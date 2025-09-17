import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Domains } from "../src/modules/domains";
import type { DomainsData, DomainsProvisionOptions } from "../src/types/domains/provision";
import { ErrorCode } from "../src/utils/errors";
import type { ListEntryOptions } from "../src/types/lists/entry";
import type { DomainsAddListEntryApiResponse } from "../src/types/domains/internal";

const fake = {
  provision: {
    domain: "example.com",
    subscriptionHandle: "subscription-handle"
  } as DomainsProvisionOptions & DomainsData,
  loginLink: "https://example.com/login",
  bulkProvisionResponse: {
    results: {
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
    }
  },
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
    } as ListEntryOptions,
    apiResponse: {
      action: "safelist",
      item: "name@example.com",
      item_type: "email_address"
    } as DomainsAddListEntryApiResponse
  },
  listDownstreamAddresses: {
    records: [
      {
        port: 25,
        priority: 10,
        target: "example.com",
        weight: 10
      }
    ]
  },
  bulkCreateLoginLinksResponse: {
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
        comment: "string",
        loginLink: "string"
      }
    ]
  }
};

describe("provision", () => {
  it("should successfully provision a domain", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.provision)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { data, error } = await domains.provision(fake.provision);

    expect(data).toBe(fake.provision);
    expect(error).toBeNull();
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

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("bulkProvision", () => {
  it("should successfully bulk provision domains", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.bulkProvisionResponse)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { results, error } = await domains.bulkProvision({ subscriptionHandle: fake.provision.subscriptionHandle }, [
      { domain: fake.provision.domain },
      { domain: fake.provision.domain }
    ]);

    expect(results).toEqual(fake.bulkProvisionResponse);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error if no domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { results, error } = await domains.bulkProvision({ subscriptionHandle: fake.provision.subscriptionHandle }, []);

    expect(error).toBe("No domains provided.");
    expect(results).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error more than 1000 domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { results, error } = await domains.bulkProvision({ subscriptionHandle: fake.provision.subscriptionHandle }, new Array(1001).fill(fake.provision.domain));

    expect(error).toBe("The maximum number of domains to be provisioned is 1000.");
    expect(results).toBeNull();
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
    const { results, error } = await domains.bulkProvision({ subscriptionHandle: fake.provision.subscriptionHandle }, [
      { domain: fake.provision.domain },
      { domain: fake.provision.domain }
    ]);

    expect(error).toBeTruthy();
    expect(results).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("list", () => {
  it("should successfully list domains", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce({ domains: fake.list, total: 1 })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { domains: domainsList, error } = await domains.list();

    expect(domainsList).toEqual(fake.list);
    expect(error).toBeNull();
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

    expect(error).toBeTruthy();
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
    const { success, error } = await domains.delete(fake.provision.domain);

    expect(mockClient.delete).toHaveBeenCalled();
    expect(error).toBeNull();
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

    expect(error).toBeTruthy();
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
    const { entry, error } = await domains.addListEntry(fake.provision.domain, fake.addListEntry.options);

    expect(entry).toEqual({
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    });
    expect(error).toBeNull();
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

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    // @ts-expect-error listName is not provided
    const { entry, error } = await domains.addListEntry(fake.provision.domain, {});

    expect(error).toBe("No list name provided.");
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

    expect(error).toBeTruthy();
    expect(entry).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("listEntries", () => {
  it("should return recipient list entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce([fake.addListEntry.apiResponse])
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { entries, error } = await domains.listEntries(fake.provision.domain, fake.addListEntry.options.listName);

    expect(entries).toEqual([{
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    }]);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { entries, error } = await domains.listEntries("", fake.addListEntry.options.listName);

    expect(error).toBe("No domain provided.");
    expect(entries).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    // @ts-expect-error listName is not provided
    const { entries, error } = await domains.listEntries(fake.provision.domain, "");

    expect(error).toBe("No list name provided.");
    expect(entries).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { entries, error } = await domains.listEntries(fake.provision.domain, fake.addListEntry.options.listName);

    expect(error).toBeTruthy();
    expect(entries).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("deleteListEntry", () => {
  it("should successfully delete a list entry", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.deleteListEntry(fake.provision.domain, fake.addListEntry.options);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.deleteListEntry("", fake.addListEntry.options);

    expect(error).toBe("No domain provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    // @ts-expect-error listName is not provided
    const { success, error } = await domains.deleteListEntry(fake.provision.domain, {});

    expect(error).toBe("No list name provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { status: ErrorCode.Forbidden } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.deleteListEntry(fake.provision.domain, fake.addListEntry.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("createLoginLink", () => {
  it("should successfully create a login link", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce({ loginLink: fake.loginLink })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { link, error } = await domains.createLoginLink(fake.provision.domain);

    expect(link).toBe(fake.loginLink);
    expect(error).toBeNull();
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

    expect(error).toBeTruthy();
    expect(link).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("setDownstreamAddress", () => {
  it("should successfully set downstream address", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.provision.domain, fake.listDownstreamAddresses.records);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress("", fake.listDownstreamAddresses.records);

    expect(error).toBe("No domain provided.");
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error when more than 10 records are provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const records = new Array(11).fill(fake.listDownstreamAddresses.records[0]);

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.provision.domain, records);

    expect(error).toBe("The maximum of records to be set is 10.");
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.provision.domain, fake.listDownstreamAddresses.records);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });
});

describe("listDownstreamAddresses", () => {
  it("should successfully list downstream address records", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce({ records: fake.listDownstreamAddresses })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { records, error } = await domains.listDownstreamAddresses(fake.provision.domain);

    expect(records).toEqual(fake.listDownstreamAddresses);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { records, error } = await domains.listDownstreamAddresses("");

    expect(error).toBe("No domain provided.");
    expect(records).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { records, error } = await domains.listDownstreamAddresses(fake.provision.domain, { limit: -1 });

    expect(error).toBe("The limit value is invalid. Only positive values are allowed.");
    expect(records).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { records, error } = await domains.listDownstreamAddresses(fake.provision.domain, { offset: -1 });

    expect(error).toBe("Offset must be greater than or equal to 0.");
    expect(records).toEqual([]);
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
    const { records, error } = await domains.listDownstreamAddresses(fake.provision.domain);

    expect(error).toBeTruthy();
    expect(records).toEqual([]);
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
    const { success, error } = await domains.updateApiKey(fake.provision.domain, "new-api-key");

    expect(success).toBe(true);
    expect(error).toBeNull();
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

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });
});

describe("bulkCreateLoginLinks", () => {
  it("should successfully bulk create login links", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.bulkCreateLoginLinksResponse)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { results, error } = await domains.bulkCreateLoginLinks([
      "example1.com",
      "example2.com"
    ]);

    expect(results).toEqual(fake.bulkCreateLoginLinksResponse);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error if no domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { results, error } = await domains.bulkCreateLoginLinks([]);

    expect(error).toBe("No domains provided.");
    expect(results).toEqual([]);
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error more than 1000 domains are provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { results, error } = await domains.bulkCreateLoginLinks(new Array(1001).fill("example.com"));

    expect(error).toBe("The maximum number of domains to create login links for is 1000.");
    expect(results).toEqual([]);
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
    const { results, error } = await domains.bulkCreateLoginLinks([
      "example1.com",
      "example2.com"
    ]);

    expect(error).toBeTruthy();
    expect(results).toEqual([]);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
