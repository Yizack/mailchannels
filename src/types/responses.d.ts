export interface SuccessResponse {
  /**
   * Whether the operation was successful.
   */
  success: boolean;
  /**
   * Error message if the operation failed.
   */
  error: string | null;
}

export interface DataResponse<T> {
  /**
   * The response data.
   */
  data: T | null;
  /**
   * Error message if the operation failed.
   */
  error: string | null;
}
