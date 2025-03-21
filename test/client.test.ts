import { describe, expect, it, vi } from "vitest";
import { $fetch } from "ofetch";
import { MailChannelsClient } from "../src/client";

const fake = {
  baseURL: "https://api.mailchannels.net",
  path: "/test",
  apiKey: "test-api-key",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
};

vi.mock("ofetch", () => ({
  $fetch: vi.fn()
}));

describe("MailChannelsClient", () => {
  it("should handle GET method correctly", async () => {
    vi.mocked($fetch).mockResolvedValueOnce({});

    const client = new MailChannelsClient(fake.apiKey);
    await client.get(fake.path);

    expect($fetch).toHaveBeenCalledWith(fake.path, {
      method: "GET",
      baseURL: fake.baseURL,
      headers: {
        ...fake.headers,
        "X-API-Key": fake.apiKey
      }
    });
  });

  it("should handle POST method correctly", async () => {
    vi.mocked($fetch).mockResolvedValueOnce({});

    const client = new MailChannelsClient(fake.apiKey);
    await client.post(fake.path);

    expect($fetch).toHaveBeenCalledWith(fake.path, {
      method: "POST",
      baseURL: fake.baseURL,
      headers: {
        ...fake.headers,
        "X-API-Key": fake.apiKey
      }
    });
  });

  it("should handle DELETE method correctly", async () => {
    vi.mocked($fetch).mockResolvedValueOnce({});

    const client = new MailChannelsClient(fake.apiKey);
    await client.delete(fake.path);

    expect($fetch).toHaveBeenCalledWith(fake.path, {
      method: "DELETE",
      baseURL: fake.baseURL,
      headers: {
        ...fake.headers,
        "X-API-Key": fake.apiKey
      }
    });
  });
});
