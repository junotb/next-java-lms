/**
 * API 관련 타입 정의
 */

export type ApiError = {
  status: number;
  code?: string;
  field?: string;
  message: string;
};

export interface ApiErrorResponse {
  error: string;
  field?: string;
  value?: string;
  message: string;
}
