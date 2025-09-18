export interface EmailsCreateDkimKeyOptions {
  /**
   * Algorithm used for the new key pair Currently, only RSA is supported.
   * @default "rsa"
   */
  algorithm?: "rsa";
  /**
   * Key length in bits. For RSA, must be a multiple of 1024. Common values: 1024 or 2048.
   * @default 2048
   */
  length?: 1024 | 2048 | 3072 | 4096;
  /**
   * Selector for the new key pair. Must be a maximum of 63 characters.
   */
  selector: string;
}

export interface EmailsDkimKey {
  /**
   * Algorithm used for the key pair.
   */
  algorithm: string;
  /**
   * Timestamp when the key pair was created.
   */
  createdAt: string;
  /**
   * Suggested DNS records for the DKIM key.
   */
  dnsRecords: {
    name: string;
    type: string;
    value: string;
  }[];
  /**
   * Domain associated with the key pair.
   */
  domain: string;
  /**
   * Key length in bits.
   */
  length: 1024 | 2048 | 3072 | 4096;
  publicKey: string;
  /**
   * Selector assigned to the key pair.
   */
  selector: string;
  /**
   * Status of the key.
   */
  status: "active" | "revoked" | "retired";
  /**
   * Timestamp when the key was last modified.
   */
  statusModifiedAt: string;
}

export interface EmailsCreateDkimKeyResponse {
  /**
   * The created DKIM key information.
   */
  key: EmailsDkimKey | null;
  error: string | null;
}
