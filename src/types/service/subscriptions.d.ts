export interface ServiceSubscriptionsResponse {
  subscriptions: {
    active: boolean;
    activeAccountsCount: number;
    handle: string;
    limits: {
      featureHandle: string;
      value: string;
    }[];
    plan: {
      handle: string;
      name: string;
    };
  }[];
  error: string | null;
}
