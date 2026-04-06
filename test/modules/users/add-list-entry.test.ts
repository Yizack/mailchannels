import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Users } from "~/modules/users";
import { ErrorCode } from "~/utils/errors";
import type { ListEntryOptions, ListEntryResponse } from "~/types/lists/entry";
import type { ListEntryApiResponse } from "~/types/lists/internal";

const fake = {
  email: "test@example.com",
  options: {
    listName: "safelist",
    item: "name@example.com"
  } satisfies ListEntryOptions,
  apiResponse: {
    action: "safelist",
    item: "name@example.com",
    item_type: "email_address"
  } satisfies ListEntryApiResponse,
  expectedResponse: {
    data: {
      action: "safelist",
      item: "name@example.com",
      type: "email_address"
    },
    error: null
  } satisfies ListEntryResponse
};

describe("addListEntry", () => {
  it("should successfully add a list entry", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry(fake.email, fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error when email is not provided", async () => {
    const mockClient = {
      post: vi.fn()
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry("", fake.options);

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
    const { data, error } = await users.addListEntry(fake.email, {});

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
    const { data, error } = await users.addListEntry(fake.email, fake.options);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry(fake.email, fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.addListEntry(fake.email, fake.options);

    expect(error).toStrictEqual({ message: "Failed to add user list entry.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });
});
