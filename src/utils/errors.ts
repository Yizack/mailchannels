import type { FetchResponse } from "ofetch";

export const enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  UnprocessableEntity = 422
}

export const getStatusError = (
  response: FetchResponse<{ message?: string, errors?: string[] } | string>,
  errors: Record<number, string> = {}
) => {
  const statusText = errors[response.status] || "Unknown error.";

  let details = "";
  if (typeof response._data === "string") {
    details = response._data;
  }
  else if (response._data?.message) {
    details = response._data.message;
  }
  else if (Array.isArray(response._data?.errors) && response._data.errors.length) {
    details = response._data.errors.join(", ");
  }

  return details ? `${statusText} ${details}` : statusText;
};
