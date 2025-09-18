import type { EmailsDkimKey } from "./create-dkim-key";

export interface EmailsUpdateDkimKeyOptions {
  /**
   * Selector of the DKIM key pair to update. Must be a maximum of 63 characters.
   */
  selector: string;
  /**
   * New status of the DKIM key pair
   * - `revoked`: Indicates that the key is compromised and should not be used.
   * - `retired`: Indicates that the key has been rotated and is no longer in use.
   */
  status: Exclude<EmailsDkimKey["status"], "active">;
}
