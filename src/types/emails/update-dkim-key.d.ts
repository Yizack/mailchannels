import type { EmailsDkimKey } from "./create-dkim-key";

export interface EmailsUpdateDkimKeyOptions {
  /**
   * Selector of the DKIM key pair to update. Must be a maximum of 63 characters.
   */
  selector: string;
  /**
   * New status of the DKIM key pair.
   * - `revoked`: Indicates that the key is compromised and should not be used.
   * - `retired`: Indicates that the key has been rotated and is no longer in use.
   * - `rotated`: Indicates that the key is going through the rotation process. Only active key pairs can be updated to this status, and no new key pair is created. The rotated key can be used to sign emails for 3 days after the status update, and will automatically change to `retired` 2 weeks after update. For a smooth key transition, it is recommended to create and publish a new key pair before signing is disabled for the rotated key.
   */
  status: Exclude<EmailsDkimKey["status"], "active">;
}
