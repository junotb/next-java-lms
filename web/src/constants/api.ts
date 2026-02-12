const isProd = process.env.NODE_ENV === "production";

/** Cloud Run 배포 후 실제 서비스 URL로 교체 (GCP Console > Cloud Run > 서비스 URL 확인) */
const PROD_API_URL = "https://lms-api-xxxxx-xx.a.run.app";
const PROD_WEB_URL = "https://lms-web-xxxxx-xx.a.run.app";

export const API_URL = isProd ? PROD_API_URL : "http://localhost:8080";
export const AUTH_CLIENT_BASE_URL = isProd ? PROD_WEB_URL : "http://localhost:3000";
