import type { DataResponse } from "../responses";

export interface SubAccountsLimit {
  sends: number;
}

export type SubAccountsLimitResponse = DataResponse<SubAccountsLimit>;
