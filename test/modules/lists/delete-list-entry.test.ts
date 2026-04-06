import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Lists } from "~/modules/lists";
import type { ListEntryOptions } from "~/types/lists/entry";

const fake = {
  options: {
    listName: "safelist",
    item: "name@example.com"
  } satisfies ListEntryOptions
};

describe("deleteListEntry", () => {
  it("should successfully delete a list entry", async () => {
    const mockClient = {
      delete: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.options);

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
      delete: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: 500 } });
      })
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.options);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const lists = new Lists(mockClient);
    const { success, error } = await lists.deleteListEntry(fake.options);

    expect(error).toStrictEqual({ message: "Failed to delete list entry.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});
