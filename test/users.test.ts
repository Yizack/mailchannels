import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Users } from "../src/modules/users";
import { ErrorCode } from "../src/utils/errors";
import type { UsersCreateApiResponse } from "../src/types/users/internal";

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
