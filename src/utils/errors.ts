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

type MailChannelsErrorResponse = { message?: string, errors?: string[] } | string;

export const getStatusError = (
  response: FetchResponse<MailChannelsErrorResponse>,
  errors: Record<number, string> = {}
) => {
  const statusText = errors[response.status] || "Unknown error.";

  const payload = response._data ?? (response as { data?: MailChannelsErrorResponse }).data;

  let details: string | undefined;

  if (typeof payload === "string") {
    details = payload;
  }
  else if (payload?.message) {
    details = payload.message;
  }
  else if (Array.isArray(payload?.errors) && payload.errors?.length) {
    details = payload.errors.join(", ");
  }

  return details ? `${statusText} ${details}` : statusText;
};

export function getResultError (result: { error: string | null }, error: unknown, fallback: string) {
  if (result.error) return result.error;
  return error instanceof Error ? error.message : fallback;
}
