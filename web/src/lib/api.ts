import axios, { AxiosError } from "axios";
import type { ApiError, ApiErrorResponse } from "@/types/api";
import { API_URL } from "@/constants/api";
import { authClient } from "@/lib/auth-client";

// 하위 호환성을 위해 타입 re-export
export type { ApiError, ApiErrorResponse } from "@/types/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 프로덕션: Web/API 도메인이 달라 쿠키 미전송 → Bearer 토큰으로 인증
api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  const { data: session } = await authClient.getSession();
  if (session?.session?.token) {
    config.headers.Authorization = `Bearer ${session.session.token}`;
  }
  return config;
});

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