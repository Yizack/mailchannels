import { $fetch, type FetchOptions } from "ofetch";
import { defineEmails } from "./emails";

export * from "./emails";

export class MailChannels {
  #setup: {
    baseURL: string;
    headers: Record<string, string>;
  };

  readonly emails = defineEmails(this);

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
