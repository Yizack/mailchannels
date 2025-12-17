import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Users } from "../src/modules/users";
import { ErrorCode } from "../src/utils/errors";
import type { ListEntryApiResponse } from "../src/types/lists/internal";
import type { UsersCreateApiResponse } from "../src/types/users/internal";
import type { ListEntryOptions } from "../src/types/lists/entry";

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
    } as ListEntryApiResponse
  }
};

describe("create", () => {
  it("should create a recipient user", async () => {
    const mockClient = {
      put: vi.fn().mockResolvedValue(fake.create.apiResponse)
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create(fake.create.email);

    expect(data).toStrictEqual({
      email: fake.create.apiResponse.recipient.email_address,
      roles: fake.create.apiResponse.recipient.roles,
      filter: fake.create.apiResponse.recipient.filter,
      listEntries: fake.create.apiResponse.list_entries.map(({ item, item_type, action }) => ({
        item,
        type: item_type,
        action
      }))
    });
    expect(error).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when no email is provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create("");

    expect(data).toBeNull();
    expect(error).toStrictEqual({ message: "No email address provided.", statusCode: null });
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
    const { data, error } = await users.create(fake.create.email);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create(fake.create.email);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create(fake.create.email);

    expect(error).toStrictEqual({ message: "Failed to create user.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });
});

describe("addListEntry", () => {
  it("should successfully add a list entry", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.addListEntry.apiResponse)
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry(fake.create.email, fake.addListEntry.options);

    expect(data).toStrictEqual({
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    });
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry("", fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "No email provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    // @ts-expect-error listName is not provided
    const { data, error } = await users.addListEntry(fake.create.email, {});

    expect(error).toStrictEqual({ message: "No list name provided.", statusCode: null });
    expect(data).toBeNull();
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
    const { data, error } = await users.addListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "Failed to add user list entry.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("listEntries", () => {
  it("should return recipient list entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce([fake.addListEntry.apiResponse])
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.listEntries(fake.create.email, fake.addListEntry.options.listName);

    expect(data).toStrictEqual([{
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

    const users = new Users(mockClient);
    const { data, error } = await users.listEntries("", fake.addListEntry.options.listName);

    expect(error).toStrictEqual({ message: "No email provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    // @ts-expect-error listName is not provided
    const { data, error } = await users.listEntries(fake.create.email, "");

    expect(error).toStrictEqual({ message: "No list name provided.", statusCode: null });
    expect(data).toBeNull();
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
    const { data, error } = await users.listEntries(fake.create.email, fake.addListEntry.options.listName);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.listEntries(fake.create.email, fake.addListEntry.options.listName);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.listEntries(fake.create.email, fake.addListEntry.options.listName);

    expect(error).toStrictEqual({ message: "Failed to fetch user list entries.", statusCode: null });
    expect(data).toBeNull();
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
    const { success, error } = await users.deleteListEntry(fake.create.email, fake.addListEntry.options);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { success, error } = await users.deleteListEntry("", fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "No email provided.", statusCode: null });
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

    expect(error).toStrictEqual({ message: "No list name provided.", statusCode: null });
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

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { success, error } = await users.deleteListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { success, error } = await users.deleteListEntry(fake.create.email, fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "Failed to delete user list entry.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});
