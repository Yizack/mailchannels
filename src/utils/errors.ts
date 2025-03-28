import type { FetchResponse } from "ofetch";

export enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  UnprocessableEntity = 422
}

export const getStatusError = (
  response: FetchResponse<{ message?: string }>,
  errors: Record<number, string> = {}
) => {
  return errors[response.status] || response._data?.message || "Unknown error.";
};
