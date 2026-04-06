import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Metrics } from "~/modules/metrics";
import { ErrorCode } from "~/utils/errors";
import type { MetricsPerformanceResponse } from "~/types/metrics/performance";
import type { MetricsPerformanceApiResponse } from "~/types/metrics/internal";
import type { MetricsOptions } from "~/types/metrics";

const fake = {
  options: {
    startTime: "2024-07-01T00:00:00Z",
    endTime: "2024-07-31T23:59:59Z",
    campaignId: "campaign123",
    interval: "day"
  } satisfies MetricsOptions,
  apiResponse: {
    bounced: 0,
    buckets: {
      bounced: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      delivered: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      processed: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }]
    },
    delivered: 0,
    end_time: "2024-07-29T15:51:28.071Z",
    processed: 0,
    start_time: "2024-07-29T15:51:28.071Z"
  } satisfies MetricsPerformanceApiResponse,
  expectedResponse: {
    data: {
      bounced: 0,
      buckets: {
        bounced: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        delivered: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        processed: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }]
      },
      delivered: 0,
      endTime: "2024-07-29T15:51:28.071Z",
      processed: 0,
      startTime: "2024-07-29T15:51:28.071Z"
    },
    error: null
  } satisfies MetricsPerformanceResponse
};

describe("performance", () => {
  it("should successfully retrieve performance metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.performance(fake.options);

    expect(data).toStrictEqual(fake.expectedResponse.data);
    expect(error).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      get: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => new Promise((_, reject) => {
        onResponseError({ response: { status: ErrorCode.BadRequest } });
        reject();
      }))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.performance();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.performance();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.performance();

    expect(error).toStrictEqual({ message: "Failed to fetch performance metrics.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
