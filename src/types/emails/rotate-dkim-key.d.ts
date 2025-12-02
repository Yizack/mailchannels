import type { EmailsDkimKey } from "./create-dkim-key";

export interface EmailsRotateDkimKeyOptions {
  newKey: {
    /**
     * Selector for the new key pair. Must be a maximum of 63 characters.
     */
    selector: string;
  };
}

export interface EmailsRotateDkimKeyResponse {
  keys: {
    new: EmailsDkimKey;
    rotated: EmailsDkimKey;
  } | null;
  error: string | null;
}
