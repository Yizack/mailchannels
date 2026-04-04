import type { EmailsDkimKey } from "./create-dkim-key";

export interface EmailsRotateDkimKeyOptions {
  /**
   * Existing selector to rotate. Must be between 1 and 63 characters.
   */
  selector: string;
  /**
   * Selector for the replacement key pair. Must be between 1 and 63 characters.
   */
  newSelector: string;
}

export interface EmailsRotateDkimKeyResponse {
  /**
   * The newly created DKIM key pair.
   */
  newKey: EmailsDkimKey | null;
  /**
   * The original DKIM key pair, now marked as rotated.
   */
  rotatedKey: EmailsDkimKey | null;
  error: string | null;
}
