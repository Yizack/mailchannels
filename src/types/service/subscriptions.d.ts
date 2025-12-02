import type { DataResponse } from "../responses";

export type ServiceSubscriptionsResponse = DataResponse<{
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
}[]>;
