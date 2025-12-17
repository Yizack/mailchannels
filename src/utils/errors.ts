import type { FetchResponse } from "ofetch";
import type { ErrorResponse } from "../types/responses";

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

export const createError = (message: string, statusCode: number | null = null): ErrorResponse => {
  return {
    message,
    statusCode
  };
};

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

  return createError(details ? `${statusText} ${details}` : statusText, response.status);
};

export const getResultError = (result: { error: ErrorResponse | null }, error: unknown, fallback: string) => {
  if (result.error) return result.error;
  return createError(error instanceof Error ? error.message : fallback);
};
