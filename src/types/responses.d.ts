export interface SuccessResponse {
  /**
   * Whether the operation was successful.
   */
  success: boolean;
  error: string | null;
}

export interface DataResponse<T> {
  data: T | null;
  error: string | null;
}
