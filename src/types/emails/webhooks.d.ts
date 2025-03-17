export interface WebhooksSigningKeyResponse {
  id: string;
  key: string;
}

export type WebhooksListApiResponse = {
  webhook: string;
}[];

export interface WebhooksListResponse {
  webhooks: string[];
}
