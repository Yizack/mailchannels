import { expect, it, vi, describe } from "vitest";
import type { MailChannelsClient } from "../src/client";
import { Webhooks } from "../src/modules/webhooks";

const fake = {
  enroll: {
    endpoint: "https://example.com/webhook"
  },
  list: {
    apiResponse: [
      { webhook: "https://example.com/webhook1" },
      { webhook: "https://example.com/webhook2" }
    ],
    expectedResponse: {
      webhooks: ["https://example.com/webhook1", "https://example.com/webhook2"]
    }
  },
  signingKey: {
    id: "key-id",
    apiResponse: { key: "public-key" }
  }
};

describe("enroll", () => {
  it("should successfully enroll a webhook endpoint", async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(undefined)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    await webhooks.enroll(fake.enroll.endpoint);

    expect(mockClient.post).toHaveBeenCalledWith("/tx/v1/webhook", {
      query: { endpoint: fake.enroll.endpoint }
    });
  });
});

describe("list", () => {
  it("should successfully list all webhook endpoints", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.list.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.list();

    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/webhook");
    expect(result).toEqual(fake.list.expectedResponse);
  });
});

describe("delete", () => {
  it("should successfully delete all webhook endpoints", async () => {
    const mockClient = {
      delete: vi.fn().mockResolvedValue(undefined)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    await webhooks.delete();

    expect(mockClient.delete).toHaveBeenCalledWith("/tx/v1/webhook");
  });
});

describe("getSigningKey", () => {
  it("should successfully retrieve a signing key", async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue(fake.signingKey.apiResponse)
    } as unknown as MailChannelsClient;

    const webhooks = new Webhooks(mockClient);
    const result = await webhooks.getSigningKey(fake.signingKey.id);

    expect(mockClient.get).toHaveBeenCalledWith("/tx/v1/webhook/public-key", {
      query: { id: fake.signingKey.id }
    });
    expect(result).toEqual(fake.signingKey.apiResponse);
  });
});
