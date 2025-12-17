export interface ErrorResponse {
  message: string;
  statusCode: number | null;
}

export interface SuccessResponse {
  /**
   * Whether the operation was successful.
   */
  success: boolean;
  /**
   * Error information if the operation failed.
   */
  error: ErrorResponse | null;
}

export interface DataResponse<T> {
  /**
   * The response data.
   */
  data: T | null;
  /**
   * Error information if the operation failed.
   */
  error: ErrorResponse | null;
}
