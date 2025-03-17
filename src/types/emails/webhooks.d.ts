export interface WebhookSigningKeyResponse {
  id: string;
  key: string;
}

export type WebhookGetApiResponse = {
  webhook: string;
}[];

export interface WebhookGetResponse {
  webhooks: string[];
}
