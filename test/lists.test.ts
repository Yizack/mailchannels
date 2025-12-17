import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Lists } from "../src/modules/lists";
import type { ListEntryApiResponse } from "../src/types/lists/internal";
import type { ListEntryOptions } from "../src/types/lists/entry";

const fake = {
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

describe("addListEntry", () => {
  it("should successfully add a list entry", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.addListEntry.apiResponse)
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.addListEntry(fake.addListEntry.options);

    expect(data).toStrictEqual({
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    });
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    // @ts-expect-error listName is not provided
    const { data, error } = await lists.addListEntry({});

    expect(error).toStrictEqual({ message: "No list name provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.addListEntry(fake.addListEntry.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.addListEntry(fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.addListEntry(fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "Failed to add list entry.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("listEntries", () => {
  it("should return recipient list entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce([fake.addListEntry.apiResponse])
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.addListEntry.options.listName);

    expect(data).toStrictEqual([{
      action: fake.addListEntry.apiResponse.action,
      item: fake.addListEntry.apiResponse.item,
      type: fake.addListEntry.apiResponse.item_type
    }]);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    // @ts-expect-error listName is not provided
    const { data, error } = await lists.listEntries("");

    expect(error).toStrictEqual({ message: "No list name provided.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { ok: false } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.addListEntry.options.listName);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.addListEntry.options.listName);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.addListEntry.options.listName);

    expect(error).toStrictEqual({ message: "Failed to fetch list entries.", statusCode: null });
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

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.addListEntry.options);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should contain error when list name is not provided", async () => {
    const mockClient = {
      delete: vi.fn()
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    // @ts-expect-error listName is not provided
    const { success, error } = await lists.deleteListEntry({});

    expect(error).toStrictEqual({ message: "No list name provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false } });
      })
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.addListEntry.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.addListEntry.options);

    expect(error).toStrictEqual({ message: "Failed to delete list entry.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});
