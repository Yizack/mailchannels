export interface WebhooksValidateResponse {
  /**
   * Indicates whether all webhook validations passed.
   */
  allPassed: boolean;
  /**
   * Detailed results for each tested webhook, including whether it returned a 2xx status code, along with its response status code and body.
   */
  results: {
    /**
     * Indicates whether the webhook responded with a 2xx HTTP status code.
     */
    result: "passed" | "failed";
    /**
     * The webhook that was validated.
     */
    webhook: string;
    /**
     * The HTTP response returned by the webhook, including status code and response body. A null value indicates no response was received. Possible reasons include timeouts, connection failures, or other network-related issues.
     */
    response: {
      /**
       * Response body from webhook. Returns an error if unprocessable or too large.
       */
      body?: string;
      /**
       * HTTP status code returned by the webhook.
       */
      status: number;
    } | null;
  }[];
  error: string | null;
}
