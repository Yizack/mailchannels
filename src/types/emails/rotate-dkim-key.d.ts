import type { EmailsDkimKey } from "./create-dkim-key";

export interface EmailsRotateDkimKeyOptions {
  newKey: {
    /**
     * Selector for the new key pair. Must be a maximum of 63 characters.
     */
    selector: string;
  };
}

import type { DataResponse } from "../responses";

export type EmailsRotateDkimKeyResponse = DataResponse<{
  new: EmailsDkimKey;
  rotated: EmailsDkimKey;
}>;
