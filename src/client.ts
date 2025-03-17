import { $fetch, type FetchOptions } from "ofetch";

export class MailChannelsClient {
  #setup: {
    baseURL: string;
    headers: Record<string, string>;
  };

  constructor (key: string) {
    this.#setup = {
      baseURL: "https://api.mailchannels.net",
      headers: {
        "X-API-Key": key,
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    };
  }

  protected async _fetch<T>(path: string, options?: FetchOptions<"json">) {
    return $fetch<T>(path, {
      baseURL: this.#setup.baseURL,
      ...options,
      headers: {
        ...this.#setup.headers,
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
