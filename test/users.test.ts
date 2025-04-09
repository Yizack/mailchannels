import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Users } from "../src/modules/users";
import { ErrorCode } from "../src/utils/errors";
import type { UsersAddListEntryApiResponse, UsersCreateApiResponse } from "../src/types/users/internal";
import type { ListEntryOptions } from "../src/types";

const fake = {
  create: {
    email: "test@example.com",
    apiResponse: {
      recipient: {
        email_address: "test@example.com",
        roles: ["TEST"],
        filter: false
      },
      list_entries: [{
        item: "name@example.com",
        item_type: "email_address",
        action: "safelist"
      }]

    } as UsersCreateApiResponse
  },
  addListEntry: {
    options: {
      listName: "safelist",
      item: "name@example.com"
    } as ListEntryOptions,
    apiResponse: {
      action: "safelist",
      item: "name@example.com",
      item_type: "email_address"
    } as UsersAddListEntryApiResponse
  }
};

describe("create", () => {
  it("should create a recipient user", async () => {
    const mockClient = {
      put: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { user } = await users.create(fake.create.email);

    expect(user).toEqual({
      email: fake.create.apiResponse.recipient.email_address,
      roles: fake.create.apiResponse.recipient.roles,
      filter: fake.create.apiResponse.recipient.filter,
      listEntries: fake.create.apiResponse.list_entries.map(({ item, item_type, action }) => ({
        item,
        type: item_type,
        action
      }))
    });
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when no email is provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { user, error } = await users.create("");

    expect(user).toBeNull();
    expect(error).toBe("No email address provided.");
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { user, error } = await users.create(fake.create.email);

    expect(error).toBeDefined();
    expect(user).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });
});

describe("addListEntry", () => {
  it("should successfully add a list entry", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.addListEntry.apiResponse)
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { entry } = await users.addListEntry(fake.create.email, fake.addListEntry.options);

    expect(entry).toEqual({
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    });
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { entry, error } = await users.addListEntry("", fake.addListEntry.options);

    expect(error).toBe("No email provided.");
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

    const users = new Users(mockClient);
    const { entry, error } = await users.addListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toBeDefined();
    expect(entry).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("listEntries", () => {
  it("should return recipient list entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce([fake.addListEntry.apiResponse])
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { entries } = await users.listEntries(fake.create.email, fake.addListEntry.options.listName);

    expect(entries).toEqual([{
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    }]);
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { entries, error } = await users.listEntries("", fake.addListEntry.options.listName);

    expect(error).toBe("No email provided.");
    expect(entries).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    // @ts-expect-error listName is not provided
    const { entries, error } = await users.listEntries(fake.create.email, "");

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

    const users = new Users(mockClient);
    const { entries, error } = await users.listEntries(fake.create.email, fake.addListEntry.options.listName);

    expect(error).toBeDefined();
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

    const users = new Users(mockClient);
    const { success } = await users.deleteListEntry(fake.create.email, fake.addListEntry.options);

    expect(success).toBe(true);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { success, error } = await users.deleteListEntry("", fake.addListEntry.options);

    expect(error).toBe("No email provided.");
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    // @ts-expect-error listName is not provided
    const { success, error } = await users.deleteListEntry(fake.create.email, {});

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

    const users = new Users(mockClient);
    const { success, error } = await users.deleteListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toBeDefined();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});
