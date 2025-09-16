export type SuppressionsTypes = "transactional" | "non-transactional";

export interface SuppressionsCreateOptions {
  /**
   * If true, the parent account creates suppression entries for all associated sub-accounts. This field is only applicable to parent accounts. Sub-accounts cannot create entries for other sub-accounts.
   * @default false
   */
  addToSubAccounts?: boolean;
  /**
   * The total number of suppression entries to create, for the parent and/or its sub-accounts, must not exceed `1000`.
   */
  entries: {
    /**
     * Must be less than `1024` characters.
     */
    notes?: string;
    /**
     * The email address to suppress. Must be a valid email address format and less than `255` characters.
     */
    recipient: string;
    /**
     * An array of types of suppression to apply to the recipient.
     * @default ["non-transactional"]
     */
    types?: SuppressionsTypes[];
  }[];
}
