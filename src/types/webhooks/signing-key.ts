import type { DataResponse } from "../responses";

export type WebhooksSigningKeyResponse = DataResponse<{
  key: string;
}>;
