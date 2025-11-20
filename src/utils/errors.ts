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

  const payload = (response as FetchResponse<unknown>)._data ?? (response as unknown as { data?: unknown }).data;

  let details: string | undefined = "";

  if (typeof payload === "string") {
    details = payload;
  }
  else if ((payload as { message?: string })?.message) {
    details = (payload as { message?: string }).message;
  }
  else if (Array.isArray((payload as { errors?: string[] })?.errors) && (payload as { errors?: string[] }).errors?.length) {
    details = (payload as { errors: string[] }).errors.join(", ");
  }

  return details ? `${statusText} ${details}` : statusText;
};
