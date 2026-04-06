import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { ErrorCode } from "~/utils/errors";
import { Suppressions } from "~/modules/suppressions";
import type { SuppressionsSource } from "~/types/suppressions/list";

const fake = {
  recipient: "test@example.com",
  source: "api" as SuppressionsSource
};

describe("delete", () => {
  it("should successfully delete suppression entry", async () => {
    const mockClient = {
      delete: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.delete(fake.recipient, fake.source);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle API error response on delete", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.delete(fake.recipient, fake.source);

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.delete(fake.recipient, fake.source);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.delete(fake.recipient, fake.source);

    expect(error).toStrictEqual({ message: "Failed to delete suppression entry.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.delete).toHaveBeenCalled();
  });
});
