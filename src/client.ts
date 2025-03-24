import { $fetch, type FetchOptions } from "ofetch";

export class MailChannelsClient {
  private static BASE_URL = "https://api.mailchannels.net";
  #headers: Record<string, string>;

  constructor (key?: string) {
    if (!key) {
      throw new Error("Missing MailChannels API key.");
    }

    this.#headers = {
      "X-API-Key": key,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
  }

  protected async _fetch<T>(path: string, options?: FetchOptions<"json">) {
    return $fetch<T>(path, {
      baseURL: MailChannelsClient.BASE_URL,
      ...options,
      headers: {
        ...this.#headers,
        ...options?.headers
      }
    });
  }

  async post<T>(path: string, options?: FetchOptions<"json">) {
    return this._fetch<T>(path, { method: "POST", ...options });
  }

  async get<T>(path: string, options?: FetchOptions<"json">) {
    return this._fetch<T>(path, { method: "GET", ...options });
  }

  async delete<T>(path: string, options?: FetchOptions<"json">) {
    return this._fetch<T>(path, { method: "DELETE", ...options });
  }
}
