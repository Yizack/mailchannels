import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { ErrorCode } from "~/utils/errors";
import { Suppressions } from "~/modules/suppressions";
import type { SuppressionsCreateOptions } from "~/types/suppressions/create";

const fake = {
  options: {
    entries: [
      {
        recipient: "test@example.com",
        types: ["transactional"],
        notes: "Test suppression"
      }
    ]
  } satisfies SuppressionsCreateOptions
};

describe("create", () => {
  it("should successfully create suppression entries", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.create(fake.options);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.create(fake.options);

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.create(fake.options);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.create(fake.options);

    expect(error).toStrictEqual({ message: "Failed to create suppression entries.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.post).toHaveBeenCalled();
  });
});
