export enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  UnprocessableEntity = 422
}

export const getStatusError = (status: number, errors: Record<number, string>) => errors[status] || "Unknown error.";
