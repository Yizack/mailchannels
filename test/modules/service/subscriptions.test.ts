import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Service } from "~/modules/service";
import { ErrorCode } from "~/utils/errors";
import type { ServiceSubscriptionsResponse } from "~/types/service/subscriptions";

const fake = {
  apiResponse: [
    {
      handle: "string",
      active: true,
      plan: {
        handle: "string",
        name: "string"
      },
      limits: [
        {
          featureHandle: "string",
          value: "string"
        }
      ],
      activeAccountsCount: 0
    }
  ] satisfies ServiceSubscriptionsResponse["data"]
};

describe("subscriptions", () => {
  it("should successfully retrieve a list of subscriptions", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(data).toStrictEqual(fake.apiResponse);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.NotFound } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const service = new Service(mockClient);
    const { data, error } = await service.subscriptions();

    expect(error).toStrictEqual({ message: "Failed to fetch subscriptions.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
