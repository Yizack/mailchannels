import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Metrics } from "~/modules/metrics";
import { ErrorCode } from "~/utils/errors";
import type { MetricsVolumeResponse } from "~/types/metrics/volume";
import type { MetricsVolumeApiResponse } from "~/types/metrics/internal";
import type { MetricsOptions } from "~/types/metrics";

const fake = {
  options: {
    startTime: "2024-07-01T00:00:00Z",
    endTime: "2024-07-31T23:59:59Z",
    campaignId: "campaign123",
    interval: "day"
  } satisfies MetricsOptions,
  apiResponse: {
    buckets: {
      delivered: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      dropped: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      processed: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }]
    },
    delivered: 0,
    dropped: 0,
    end_time: "2024-07-29T15:51:28.071Z",
    processed: 0,
    start_time: "2024-07-29T15:51:28.071Z"
  } satisfies MetricsVolumeApiResponse,
  expectedResponse: {
    data: {
      buckets: {
        delivered: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        dropped: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        processed: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }]
      },
      delivered: 0,
      dropped: 0,
      endTime: "2024-07-29T15:51:28.071Z",
      processed: 0,
      startTime: "2024-07-29T15:51:28.071Z"
    },
    error: null
  } satisfies MetricsVolumeResponse
};

describe("volume", () => {
  it("should successfully retrieve volume metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.volume(fake.options);

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
    const { data, error } = await metrics.volume();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.volume();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.volume();

    expect(error).toStrictEqual({ message: "Failed to fetch volume metrics.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
