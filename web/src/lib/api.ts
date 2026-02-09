import axios, { AxiosError } from "axios";
import type { ApiError, ApiErrorResponse } from "@/types/api";
import { API_URL } from "@/constants/api";

// 하위 호환성을 위해 타입 re-export
export type { ApiError, ApiErrorResponse } from "@/types/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 자동 전송 (Better-Auth 세션 쿠키 포함)
});

// Bearer Token 추출 로직 제거
// 쿠키가 자동으로 전송되므로 추가 작업 불필요

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      const apiError: ApiError = {
        status,
        code: data?.error,
        field: data?.field,
        message: data?.message || "An error occurred",
      };

      return Promise.reject(apiError);
    }

    return Promise.reject({
      status: 0,
      message: "Cannot connect to server",
    } satisfies ApiError);
  }
);

export default api;