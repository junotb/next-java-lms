/**
 * 방문 분석 설정 상수.
 * 공급자(Provider)와 키만 바꾸면 다른 분석 도구로 이전할 수 있도록 구성합니다.
 */

export type AnalyticsProvider = "ga4" | "none";

const analyticsProviderRaw =
  process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase() ?? "ga4";
const ga4MeasurementId =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() ?? "";

/** 현재 활성화된 분석 공급자 */
export const ANALYTICS_PROVIDER: AnalyticsProvider =
  analyticsProviderRaw === "ga4" ? "ga4" : "none";

/** GA4 측정 ID (예: G-XXXXXXXXXX) */
export const GA4_MEASUREMENT_ID = ga4MeasurementId;

/** 운영 환경 + 공급자 설정이 유효할 때만 방문 추적 활성화 */
export const IS_ANALYTICS_ENABLED =
  process.env.NODE_ENV === "production" &&
  ANALYTICS_PROVIDER === "ga4" &&
  GA4_MEASUREMENT_ID.length > 0;
