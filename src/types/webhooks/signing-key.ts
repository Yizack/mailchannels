import type { DataResponse } from "../responses";

export type WebhooksSigningKeyResponse = DataResponse<{
  /**
   * The ID of the key.
   */
  id: string;
  /**
   * The public key used to verify webhook signatures.
   */
  key: string;
}>;
