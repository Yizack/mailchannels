
import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { ErrorCode } from "../src/utils/errors";
import { Suppressions } from "../src/modules/suppressions";
import type { SuppressionsCreateOptions, SuppressionsListOptions } from "../src/types/suppressions";
import type { SuppressionsListApiResponse } from "../src/types/suppressions/internal";

const fake = {
  create: {
    options: {
      entries: [
        {
          recipient: "test@example.com",
          types: ["transactional"],
          notes: "Test suppression"
        }
      ]
    } satisfies SuppressionsCreateOptions
  },
  delete: {
    recipient: "test@example.com",
    source: "api" as const
  },
  list: {
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
      list: [
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
    }
  }
};

describe("create", () => {
  it("should successfully create suppression entries", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.create(fake.create.options);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.post).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      post: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false, status: ErrorCode.BadRequest } });
      })
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.create(fake.create.options);

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.post).toHaveBeenCalled();
  });
});

describe("delete", () => {
  it("should successfully delete suppression entry", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: true } });
      })
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.delete(fake.delete.recipient, fake.delete.source);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.delete).toHaveBeenCalled();
  });

  it("should handle API error response on delete", async () => {
    const mockClient = {
      delete: vi.fn().mockImplementationOnce(async (url, { onResponse }) => {
        onResponse({ response: { ok: false, status: 400 } });
      })
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { success, error } = await suppressions.delete(fake.delete.recipient, fake.delete.source);

    expect(success).toBe(false);
    expect(error).toBeTruthy();
    expect(mockClient.delete).toHaveBeenCalled();
  });
});

describe("list", () => {
  it("should successfully list suppression entries", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { list, error } = await suppressions.list(fake.list.options);

    expect(list).toEqual(fake.list.expectedResponse.list);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit (0)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { list, error } = await suppressions.list({ ...fake.list.options, limit: 0 });

    expect(error).toBe("The limit must be between 1 and 1000.");
    expect(list).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid limit (1001)", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { list, error } = await suppressions.list({ ...fake.list.options, limit: 1001 });

    expect(error).toBe("The limit must be between 1 and 1000.");
    expect(list).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const suppressions = new Suppressions(mockClient);
    const { list, error } = await suppressions.list({ ...fake.list.options, offset: -1 });

    expect(error).toBe("Offset must be greater than or equal to 0.");
    expect(list).toEqual([]);
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
    const { list, error } = await suppressions.list();

    expect(error).toBeTruthy();
    expect(list).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});
