import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Metrics } from "../src/modules/metrics";
import { ErrorCode } from "../src/utils/errors";
import type { MetricsEngagementResponse, MetricsOptions, MetricsPerformanceResponse } from "../src/types/metrics";
import type { MetricsEngagementApiResponse, MetricsPerformanceApiResponse, MetricsRecipientBehaviourApiResponse, MetricsSenderApiResponse, MetricsUsageApiResponse, MetricsVolumeApiResponse } from "../src/types/metrics/internal";
import type { MetricsRecipientBehaviourResponse } from "../src/types/metrics/recipient-behaviour";
import type { MetricsSenderOptions, MetricsSenderResponse } from "../src/types/metrics/sender";
import type { MetricsVolumeResponse } from "../src/types/metrics/volume";
import type { MetricsUsageResponse } from "../src/types/metrics/usage";

const fake = {
  options: {
    startTime: "2024-07-01T00:00:00Z",
    endTime: "2024-07-31T23:59:59Z",
    campaignId: "campaign123",
    interval: "day"
  } satisfies MetricsOptions,
  senderOptions: {
    startTime: "2024-07-01T00:00:00Z",
    endTime: "2024-07-31T23:59:59Z",
    limit: 5,
    offset: 10,
    sortOrder: "asc"
  } satisfies MetricsSenderOptions,
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
    } satisfies MetricsEngagementApiResponse,
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
    } satisfies MetricsEngagementResponse
  },
  performance: {
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
      performance: {
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
  },
  recipientBehaviour: {
    apiResponse: {
      buckets: {
        unsubscribe_delivered: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }],
        unsubscribed: [{ count: 0, period_start: "2024-07-29T15:51:28.071Z" }]
      },
      end_time: "2024-07-29T15:51:28.071Z",
      start_time: "2024-07-29T15:51:28.071Z",
      unsubscribe_delivered: 0,
      unsubscribed: 0
    } satisfies MetricsRecipientBehaviourApiResponse,
    expectedResponse: {
      behaviour: {
        buckets: {
          unsubscribeDelivered: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }],
          unsubscribed: [{ count: 0, periodStart: "2024-07-29T15:51:28.071Z" }]
        },
        endTime: "2024-07-29T15:51:28.071Z",
        startTime: "2024-07-29T15:51:28.071Z",
        unsubscribeDelivered: 0,
        unsubscribed: 0
      },
      error: null
    } satisfies MetricsRecipientBehaviourResponse
  },
  senderMetrics: {
    apiResponse: {
      end_time: "2024-07-31T23:59:59Z",
      limit: 5,
      offset: 10,
      senders: [{
        bounced: 2,
        delivered: 80,
        dropped: 3,
        name: "campaign-123",
        processed: 83
      }],
      start_time: "2024-07-01T00:00:00Z",
      total: 20
    } satisfies MetricsSenderApiResponse,
    expectedResponse: {
      endTime: "2024-07-31T23:59:59Z",
      error: null,
      limit: 5,
      offset: 10,
      senders: [{
        bounced: 2,
        delivered: 80,
        dropped: 3,
        name: "campaign-123",
        processed: 83
      }],
      startTime: "2024-07-01T00:00:00Z",
      total: 20
    } satisfies MetricsSenderResponse
  },
  volume: {
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
      volume: {
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
  },
  usage: {
    apiResponse: {
      period_end_date: "2025-04-11",
      period_start_date: "2025-03-12",
      total_usage: 5000
    } satisfies MetricsUsageApiResponse,
    expectedResponse: {
      usage: {
        endDate: "2025-04-11",
        startDate: "2025-03-12",
        total: 5000
      },
      error: null
    } satisfies MetricsUsageResponse
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
        onResponseError({ response: { status: ErrorCode.BadRequest } });
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

describe("performance", () => {
  it("should successfully retrieve performance metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.performance.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { performance, error } = await metrics.performance(fake.options);

    expect(performance).toEqual(fake.performance.expectedResponse.performance);
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
    const { performance, error } = await metrics.performance();

    expect(error).toBeTruthy();
    expect(performance).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("recipientBehaviour", () => {
  it("should successfully retrieve recipient behaviour metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.recipientBehaviour.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { behaviour, error } = await metrics.recipientBehaviour(fake.options);

    expect(behaviour).toEqual(fake.recipientBehaviour.expectedResponse.behaviour);
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
    const { behaviour, error } = await metrics.recipientBehaviour();

    expect(error).toBeTruthy();
    expect(behaviour).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("senderMetrics", () => {
  it("should successfully retrieve sender metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.senderMetrics.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const result = await metrics.senderMetrics("campaigns", fake.senderOptions);

    expect(result).toEqual(fake.senderMetrics.expectedResponse);
    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/metrics/senders/campaigns", expect.objectContaining({
      query: {
        start_time: "2024-07-01T00:00:00Z",
        end_time: "2024-07-31T23:59:59Z",
        limit: 5,
        offset: 10,
        sort_order: "asc"
      }
    }));
  });

  it("should contain error for invalid limit", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;
    const metrics = new Metrics(mockClient);

    const result = await metrics.senderMetrics("sub-accounts", { limit: 1001 });

    expect(result.error).toBe("The limit value is invalid. Possible limit values are 1 to 1000.");
    expect(result.senders).toEqual([]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it("should contain error for invalid offset", async () => {
    const mockClient = { get: vi.fn() } as unknown as MailChannelsClient;
    const metrics = new Metrics(mockClient);

    const result = await metrics.senderMetrics("sub-accounts", { offset: -1 });

    expect(result.error).toBe("Offset must be greater than or equal to 0.");
    expect(result.senders).toEqual([]);
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
    const result = await metrics.senderMetrics("campaigns");

    expect(result.error).toBeTruthy();
    expect(result.senders).toEqual([]);
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("volume", () => {
  it("should successfully retrieve volume metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.volume.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { volume, error } = await metrics.volume(fake.options);

    expect(volume).toEqual(fake.volume.expectedResponse.volume);
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
    const { volume, error } = await metrics.volume();

    expect(error).toBeTruthy();
    expect(volume).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("usage", () => {
  it("should successfully retrieve usage metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.usage.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { usage, error } = await metrics.usage();

    expect(usage).toEqual(fake.usage.expectedResponse.usage);
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
    const { usage, error } = await metrics.usage();

    expect(error).toBeTruthy();
    expect(usage).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
