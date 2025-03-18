import { describe, it, expect, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { SubAccounts } from "../src/modules/sub-accounts";
import type { SubAccountsListOptions, SubAccountsListResponse } from "../src/types/sub-accounts/list";

const fake = {
  list: {
    options: { limit: 10, offset: 0 } as SubAccountsListOptions,
    apiResponse: [
      { enabled: true, handle: "sub-account-1" },
      { enabled: false, handle: "sub-account-2" }
    ] as SubAccountsListResponse["accounts"],
    expectedResponse: {
      accounts: [
        { enabled: true, handle: "sub-account-1" },
        { enabled: false, handle: "sub-account-2" }
      ]
    } as SubAccountsListResponse
  }
};


describe("list", () => {
  it("should retrieve a list of sub-accounts with default options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.list();

    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/sub-account", {
      query: undefined
    });
    expect(result).toEqual(fake.list.expectedResponse);
  });

  it("should retrieve a list of sub-accounts with custom options", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const subAccounts = new SubAccounts(mockClient);
    const result = await subAccounts.list(fake.list.options);

    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/sub-account", {
      query: fake.list.options
    });
    expect(result).toEqual(fake.list.expectedResponse);
  });
});
