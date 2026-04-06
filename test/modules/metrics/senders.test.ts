import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Metrics } from "~/modules/metrics";
import { ErrorCode } from "~/utils/errors";
import type { MetricsSendersResponse } from "~/types/metrics/senders";
import type { MetricsSendersApiResponse } from "~/types/metrics/internal";

const fake = {
  apiResponse: {
    start_time: "2025-11-02T03:37:58.989566774Z",
    end_time: "2025-12-02T03:37:58.989566774Z",
    limit: 10,
    offset: 0,
    total: 1,
    senders: [
      {
        name: "",
        processed: 14,
        delivered: 14,
        dropped: 0,
        bounced: 0
      }
    ]
  } satisfies MetricsSendersApiResponse,
  expectedResponse: {
    data: {
      startTime: "2025-11-02T03:37:58.989566774Z",
      endTime: "2025-12-02T03:37:58.989566774Z",
      limit: 10,
      offset: 0,
      total: 1,
      senders: [
        {
          name: "",
          processed: 14,
          delivered: 14,
          dropped: 0,
          bounced: 0
        }
      ]
    },
    error: null
  } satisfies MetricsSendersResponse
};

describe("senders", () => {
  it("should successfully retrieve senders metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns");

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns", { limit: 1001 });

    expect(error).toStrictEqual({ message: "The limit value must be between 1 and 1000.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = {
      get: vi.fn()
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns", { offset: -1 });

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

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns");

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns");

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns");

    expect(error).toStrictEqual({ message: "Failed to fetch senders metrics.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
