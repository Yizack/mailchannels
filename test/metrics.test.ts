import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Metrics } from "../src/modules/metrics";
import { ErrorCode } from "../src/utils/errors";
import type { MetricsEngagementResponse, MetricsOptions, MetricsPerformanceResponse } from "../src/types/metrics";
import type { MetricsEngagementApiResponse, MetricsPerformanceApiResponse, MetricsRecipientBehaviourApiResponse, MetricsSendersApiResponse, MetricsUsageApiResponse, MetricsVolumeApiResponse } from "../src/types/metrics/internal";
import type { MetricsRecipientBehaviourResponse } from "../src/types/metrics/recipient-behaviour";
import type { MetricsVolumeResponse } from "../src/types/metrics/volume";
import type { MetricsUsageResponse } from "../src/types/metrics/usage";
import type { MetricsSendersResponse } from "../src/types/metrics/senders";

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
      data: {
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
  },
  usage: {
    apiResponse: {
      period_end_date: "2025-04-11",
      period_start_date: "2025-03-12",
      total_usage: 5000
    } satisfies MetricsUsageApiResponse,
    expectedResponse: {
      data: {
        endDate: "2025-04-11",
        startDate: "2025-03-12",
        total: 5000
      },
      error: null
    } satisfies MetricsUsageResponse
  },
  senders: {
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
  }
};

describe("engagement", () => {
  it("should successfully retrieve engagement metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.engagement.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.engagement(fake.options);

    expect(data).toStrictEqual(fake.engagement.expectedResponse.data);
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

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.engagement();

    expect(error).toBe("Failed to fetch engagement metrics.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("performance", () => {
  it("should successfully retrieve performance metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.performance.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.performance(fake.options);

    expect(data).toStrictEqual(fake.performance.expectedResponse.data);
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

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.performance();

    expect(error).toBe("Failed to fetch performance metrics.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("recipientBehaviour", () => {
  it("should successfully retrieve recipient behaviour metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.recipientBehaviour.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.recipientBehaviour(fake.options);

    expect(data).toStrictEqual(fake.recipientBehaviour.expectedResponse.data);
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
    const { data, error } = await metrics.recipientBehaviour();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.recipientBehaviour();

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.recipientBehaviour();

    expect(error).toBe("Failed to fetch recipient behaviour metrics.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("volume", () => {
  it("should successfully retrieve volume metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.volume.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.volume(fake.options);

    expect(data).toStrictEqual(fake.volume.expectedResponse.data);
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

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.volume();

    expect(error).toBe("Failed to fetch volume metrics.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("usage", () => {
  it("should successfully retrieve usage metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.usage.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.usage();

    expect(data).toStrictEqual(fake.usage.expectedResponse.data);
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
    const { data, error } = await metrics.usage();

    expect(error).toBeTruthy();
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block errors if onResponseError is not triggered", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.usage();

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.usage();

    expect(error).toBe("Failed to fetch usage metrics.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});

describe("senders", () => {
  it("should successfully retrieve senders metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.senders.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns");

    expect(data).toStrictEqual(fake.senders.expectedResponse.data);
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

    expect(error).toBe("failure");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.senders("campaigns");

    expect(error).toBe("Failed to fetch senders metrics.");
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
