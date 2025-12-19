import axios, { AxiosError } from "axios";

export type ApiError = {
  status: number;
  code?: string;
  field?: string;
  message: string;
};

export interface ApiErrorResponse {
  error: string;   // 예: DUPLICATE_RESOURCE
  field?: string; // 예: email
  value?: string;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
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