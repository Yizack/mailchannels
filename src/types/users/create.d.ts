export interface UsersCreateOptions {
  /**
   * Flag to indicate if the user is a domain admin or a regular user.
   * @default false
   */
  admin?: boolean;
  /**
   * Whether or not to filter mail for this recipient. There are three valid values.
   * - `false` -  Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, return an error.
   * - `true` - Filtering policy will not be applied to messages intended for this recipient.
   * - `compute` - Filtering policy will be applied to messages intended for this recipient. If this would exceed the protected-addresses limit, filtering policy will not be applied, and no error will be returned.
   * @default 'compute'
   */
  filter?: boolean | "compute";
  /**
   * safelist and blocklist entries to be added.
   */
  listEntries?: {
    blocklist?: string[];
    safelist?: string[];
  };
}

export interface UsersCreateResponse {
  user: {
    email: string;
    roles: string[];
    filter?: boolean;
    listEntries: {
      item: string;
      type: "domain" | "email_address" | "ip_address";
      action: "safelist" | "blocklist";
    }[];
  } | null;
  error: string | null;
}
