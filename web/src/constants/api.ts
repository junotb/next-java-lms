const isProd = process.env.NODE_ENV === "production";

/** Cloud Run 배포 후 실제 서비스 URL로 교체 (GCP Console > Cloud Run > 서비스 URL 확인) */
const PROD_API_URL = "https://lms-api-342883012014.asia-northeast3.run.app";
const PROD_WEB_URL = "https://lms-web-342883012014.asia-northeast3.run.app";

export const API_URL = isProd ? PROD_API_URL : "http://localhost:8080";
export const AUTH_CLIENT_BASE_URL = isProd ? PROD_WEB_URL : "http://localhost:3000";
export const TEACHER_TIME_OFF_BASE_URL = "/api/v1/teachers/me/time-off";
