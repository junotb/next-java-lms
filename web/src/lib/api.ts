import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authClient } from "./auth-client";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 클라이언트 사이드에서만 세션 토큰을 가져옴
    if (typeof window !== "undefined") {
      try {
        const session = await authClient.getSession();
        const sessionData = session?.data;

        // better-auth 세션에서 토큰 추출 (여러 가능한 경로 확인)
        let token: string | undefined;

        if (sessionData) {
          // 경로 1: session.session.token
          if ("session" in sessionData && sessionData.session) {
            const sessionObj = sessionData.session as Record<string, unknown>;
            token = sessionObj.token as string | undefined;
          }

          // 경로 2: session.token
          if (!token && "token" in sessionData) {
            token = sessionData.token as string | undefined;
          }

          // 경로 3: session.sessionToken
          if (!token && "sessionToken" in sessionData) {
            token = sessionData.sessionToken as string | undefined;
          }
        }

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // 세션을 가져오지 못한 경우 무시 (인증되지 않은 요청일 수 있음)
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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