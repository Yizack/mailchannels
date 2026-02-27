import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Users } from "~/modules/users";
import { ErrorCode } from "~/utils/errors";
import type { UsersCreateResponse } from "~/types/users/create";
import type { UsersCreateApiResponse } from "~/types/users/internal";

const fake = {
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
  } satisfies UsersCreateApiResponse,
  expectedResponse: {
    data: {
      email: "test@example.com",
      roles: ["TEST"],
      filter: false,
      listEntries: [{
        item: "name@example.com",
        type: "email_address",
        action: "safelist"
      }]
    },
    error: null
  } satisfies UsersCreateResponse
};

describe("create", () => {
  it("should create a recipient user", async () => {
    const mockClient = {
      put: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create(fake.email);

    expect(data).toStrictEqual(fake.expectedResponse.data);
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
    const { data, error } = await users.create(fake.email);

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create(fake.email);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const users = new Users(mockClient);
    const { data, error } = await users.create(fake.email);

    expect(error).toStrictEqual({ message: "Failed to create user.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });
});
