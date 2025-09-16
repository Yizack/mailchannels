export interface WebhooksValidateApiResponse {
  all_passed: boolean;
  results: {
    result: "passed" | "failed";
    webhook: string;
    response: {
      body?: string;
      status: number;
    } | null;
  }[];
}
