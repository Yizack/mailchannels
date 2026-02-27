import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Emails } from "~/modules/emails";
import { ErrorCode } from "~/utils/errors";

describe("updateDkimKey", () => {
  it("should successfully update a DKIM key", async () => {
    const mockClient = {
      patch: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels_test",
      status: "retired"
    });

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.patch).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      patch: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
      })
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels_test",
      status: "retired"
    });

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.patch).toHaveBeenCalled();
  });

  it("should return error if selector is missing or more than 63 characters", async () => {
    const mockClient = { patch: vi.fn() } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "a".repeat(64),
      status: "retired"
    });

    expect(success).toBe(false);
    expect(error).toStrictEqual({ message: "Selector must be between 1 and 63 characters.", statusCode: null });
    expect(mockClient.patch).not.toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      patch: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels",
      status: "retired"
    });

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.patch).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      patch: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const emails = new Emails(mockClient);
    const { success, error } = await emails.updateDkimKey("example.com", {
      selector: "mailchannels",
      status: "retired"
    });

    expect(error).toStrictEqual({ message: "Failed to update DKIM key.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.patch).toHaveBeenCalled();
  });
});
