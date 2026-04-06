import { $fetch, type FetchOptions } from "ofetch";

export interface MailChannelsClientOptions {
  /**
   * Override the MailChannels API base URL.
   * Useful for local testing against a simulator.
   * @default "https://api.mailchannels.net"
   */
  baseUrl?: string;
}

export class MailChannelsClient {
  private static readonly DEFAULT_BASE_URL = "https://api.mailchannels.net";
  readonly #baseUrl: string;
  #headers: Record<string, string>;

  constructor (key: string, options: MailChannelsClientOptions = {}) {
    if (!key) {
      throw new Error("Missing MailChannels API key.");
    }

    this.#baseUrl = options.baseUrl || MailChannelsClient.DEFAULT_BASE_URL;
    this.#headers = {
      "X-API-Key": key,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
  }

  protected async _fetch<T>(path: string, options?: FetchOptions<"json">) {
    return $fetch<T>(path, {
      baseURL: this.#baseUrl,
      ...options,
      headers: {
        ...this.#headers,
        ...options?.headers
      }
    });
  }

  async post<T>(path: string, options?: Omit<FetchOptions<"json">, "method">) {
    return this._fetch<T>(path, { method: "POST", ...options });
  }

  async get<T>(path: string, options?: Omit<FetchOptions<"json">, "method">) {
    return this._fetch<T>(path, { method: "GET", ...options });
  }

  async delete<T>(path: string, options?: Omit<FetchOptions<"json">, "method">) {
    return this._fetch<T>(path, { method: "DELETE", ...options });
  }

  async put<T>(path: string, options?: Omit<FetchOptions<"json">, "method">) {
    return this._fetch<T>(path, { method: "PUT", ...options });
  }

  async patch<T>(path: string, options?: Omit<FetchOptions<"json">, "method">) {
    return this._fetch<T>(path, { method: "PATCH", ...options });
  }
}
