import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Lists } from "~/modules/lists";
import type { ListEntryApiResponse } from "~/types/lists/internal";
import type { ListEntriesResponse, ListNames } from "~/types/lists/entry";

const fake = {
  listName: "safelist" as ListNames,
  apiResponse: [{
    action: "safelist",
    item: "name@example.com",
    item_type: "email_address"
  }] satisfies ListEntryApiResponse[],
  expectedResponse: {
    data: [{
      action: "safelist",
      item: "name@example.com",
      type: "email_address"
    }],
    error: null
  } satisfies ListEntriesResponse
};

describe("listEntries", () => {
  it("should return recipient list entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.listName);

    expect(data).toStrictEqual(fake.expectedResponse.data);
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
        onResponseError({ response: { status: 500 } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.listName);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.listName);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { data, error } = await lists.listEntries(fake.listName);

    expect(error).toStrictEqual({ message: "Failed to fetch list entries.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
