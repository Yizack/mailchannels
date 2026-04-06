import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Metrics } from "~/modules/metrics";
import { ErrorCode } from "~/utils/errors";
import type { MetricsUsageResponse } from "~/types/metrics/usage";
import type { MetricsUsageApiResponse } from "~/types/metrics/internal";

const fake = {
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
};

describe("usage", () => {
  it("should successfully retrieve usage metrics", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValueOnce(fake.apiResponse)
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.usage();

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

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const metrics = new Metrics(mockClient);
    const { data, error } = await metrics.usage();

    expect(error).toStrictEqual({ message: "Failed to fetch usage metrics.", statusCode: null });
    expect(data).toBeNull();
    expect(mockClient.get).toHaveBeenCalled();
  });
});
