import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Metrics } from "../src/modules/metrics";
import { ErrorCode } from "../src/utils/errors";
import type { MetricsOptions } from "../src/types/metrics";

const fake = {
  options: {
    startTime: "2024-07-01T00:00:00Z",
    endTime: "2024-07-31T23:59:59Z",
    campaignId: "campaign123",
    interval: "day"
  } satisfies MetricsOptions,
  engagement: {
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
    },
    expectedResponse: {
      engagement: {
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
    }
  }
};

describe("engagement", () => {
  it("should successfully retrieve engagement metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.engagement.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { engagement, error } = await metrics.engagement(fake.options);

    expect(engagement).toEqual(fake.engagement.expectedResponse.engagement);
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

    const metrics = new Metrics(mockClient);
    const { engagement, error } = await metrics.engagement();

    expect(error).toBeTruthy();
    expect(engagement).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
