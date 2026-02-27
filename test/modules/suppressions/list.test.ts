import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { ErrorCode } from "~/utils/errors";
import { Suppressions } from "~/modules/suppressions";
import type { SuppressionsListApiResponse } from "~/types/suppressions/internal";
import type { SuppressionsListOptions, SuppressionsListResponse } from "~/types/suppressions/list";

const fake = {
  options: {
    recipient: "test@example.com"
  } satisfies SuppressionsListOptions,
  apiResponse: {
    suppression_list: [
      {
        created_at: "2024-07-29T15:51:28.071Z",
        notes: "string",
        recipient: "string",
        sender: "string",
        source: "api",
        suppression_types: [
          "transactional"
        ]
      }
    ]
  } satisfies SuppressionsListApiResponse,
  expectedResponse: {
    data: [
      {
        createdAt: "2024-07-29T15:51:28.071Z",
        notes: "string",
        recipient: "string",
        sender: "string",
        source: "api",
        types: [
          "transactional"
        ]
      }
    ],
    error: null
  } satisfies SuppressionsListResponse
};

describe("list", () => {
  it("should successfully list suppression entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list(fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit (0)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list({ ...fake.options, limit: 0 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 1000.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid limit (1001)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list({ ...fake.options, limit: 1001 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 1000.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list({ ...fake.options, offset: -1 });

    expect(error).toStrictEqual({ message: "Offset must be greater than or equal to 0.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { data, error } = await suppressions.list();

    expect(error).toStrictEqual({ message: "Failed to fetch suppression entries.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
