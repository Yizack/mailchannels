export interface WebhooksVerifyOptions {
  /**
   * The raw body of the incoming webhook request as a string. This should be the exact payload received from the webhook, without any modifications or parsing, to ensure accurate signature verification.
   */
  payload: string;
  /**
   * The headers of the incoming webhook request as a record of key-value pairs. These headers should include `content-digest`, `signature`, and `signature-input` required for validating the authenticity of the webhook request.
   */
  headers: Record<string, string> | {
    "content-digest": string;
    "signature": string;
    "signature-input": string;
  };
  /**
   * The public key used to verify the webhook signature. If not provided, the default public key associated with the webhook will be used.
   */
  publicKey?: string;
}
