import { describe, expect, it, vi } from "vitest";
import type { MailChannelsClient } from "~/client";
import { Domains } from "~/modules/domains";
import { ErrorCode } from "~/utils/errors";
import type { DomainsDownstreamAddress } from "~/types/domains/downstream-addresses";

const fake = {
  domain: "example.com",
  records: [
    {
      port: 25,
      priority: 10,
      target: "example.com",
      weight: 10
    }
  ] satisfies DomainsDownstreamAddress[]
};

describe("setDownstreamAddress", () => {
  it("should successfully set downstream address", async () => {
    const mockClient = {
      put: vi.fn().mockResolvedValueOnce(void 0)
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.domain, fake.records);

    expect(success).toBe(true);
    expect(error).toBeNull();
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should contain error when domain is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress("", fake.records);

    expect(error).toStrictEqual({ message: "No domain provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error when records is not provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    // @ts-expect-error records is not provided
    const { success, error } = await domains.setDownstreamAddress(fake.domain);

    expect(error).toStrictEqual({ message: "No records provided.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error when more than 10 records are provided", async () => {
    const mockClient = {
      put: vi.fn()
    } as unknown as MailChannelsClient;

    const records = new Array(11).fill(fake.records[0]);

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.domain, records);

    expect(error).toStrictEqual({ message: "The maximum of records to be set is 10.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).not.toHaveBeenCalled();
  });

  it("should contain error on api response error", async () => {
    const mockClient = {
      put: vi.fn().mockImplementationOnce(async (url, { onResponseError }) => {
        onResponseError({ response: { status: ErrorCode.Forbidden } });
      })
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.domain, fake.records);

    expect(error).toBeTruthy();
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block errors", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce(new Error("failure"))
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.domain, fake.records);

    expect(error).toStrictEqual({ message: "failure", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });

  it("should handle catch block with non-Error rejections", async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValueOnce("error")
    } as unknown as MailChannelsClient;

    const domains = new Domains(mockClient);
    const { success, error } = await domains.setDownstreamAddress(fake.domain, fake.records);

    expect(error).toStrictEqual({ message: "Failed to set downstream address.", statusCode: null });
    expect(success).toBe(false);
    expect(mockClient.put).toHaveBeenCalled();
  });
});
