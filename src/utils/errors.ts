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

  return createError(details ? `${statusText} ${details}` : statusText, response.status ?? null);
};

export const getResultError = (e: unknown, fallback: string) => {
  return createError(e instanceof Error ? e.message : fallback);
};

export const validatePagination = (pagination: Partial<{
  limit: number;
  max: number;
  offset: number;
}> = {}) => {
  const { limit, offset, max } = pagination;
  if (typeof limit === "number" && (limit < 1 || (max && limit > max))) {
    return createError("The limit value " + (max ? `must be between 1 and ${max}.` : "is invalid. Only positive values are allowed."));
  }
  if (typeof offset === "number" && offset < 0) {
    return createError("Offset must be greater than or equal to 0.");
  }
  return null;
};
