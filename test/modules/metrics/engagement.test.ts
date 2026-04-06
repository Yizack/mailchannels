import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Metrics } from "~/modules/metrics";
import { ErrorCode } from "~/utils/errors";
import type { MetricsEngagementResponse } from "~/types/metrics/engagement";
import type { MetricsEngagementApiResponse } from "~/types/metrics/internal";
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
      click: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      click_tracking_delivered: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      open: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
      open_tracking_delivered: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }]
    },
    click: 0,
    click_tracking_delivered: 0,
    end_time: "2024-07-29T15:51:28.071Z",
    open: 0,
    open_tracking_delivered: 0,
    start_time: "2024-07-29T15:51:28.071Z"
  } satisfies MetricsEngagementApiResponse,
  expectedResponse: {
    data: {
      buckets: {
        click: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        clickTrackingDelivered: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        open: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
        openTrackingDelivered: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }]
      },
      click: 0,
      clickTrackingDelivered: 0,
      endTime: "2024-07-29T15:51:28.071Z",
      open: 0,
      openTrackingDelivered: 0,
      startTime: "2024-07-29T15:51:28.071Z"
    },
    error: null
  } satisfies MetricsEngagementResponse
};

describe("engagement", () => {
  it("should successfully retrieve engagement metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.engagement(fake.options);

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
    const { data, error } = await metrics.engagement();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.engagement();

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.engagement();

    expect(error).toStrictEqual({ message: "Failed to fetch engagement metrics.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
