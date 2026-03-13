import {
  ANALYTICS_PROVIDER,
  GA4_MEASUREMENT_ID,
  IS_ANALYTICS_ENABLED,
} from "@/constants/analytics";
import type { AnalyticsErrorCode, AnalyticsRole } from "@/constants/analytics-events";

type AnalyticsParams = Record<string, string | number | boolean | null>;

type GtagCommand = "config" | "event" | "js";
type Gtag = (command: GtagCommand, target: string | Date, params?: AnalyticsParams) => void;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
};

/**
 * 경로 prefix를 기반으로 역할 컨텍스트를 추정합니다.
 */
export function getRoleFromPath(path: string): AnalyticsRole {
  if (path.startsWith("/admin")) {
    return "admin";
  }

  if (path.startsWith("/teach")) {
    return "teach";
  }

  if (path.startsWith("/study")) {
    return "study";
  }

  return "guest";
}

/**
 * 예외 객체를 안전한 분석용 오류 코드로 변환합니다.
 */
export function toAnalyticsErrorCode(error: unknown): AnalyticsErrorCode {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number"
  ) {
    const status = (error as { status: number }).status;
    if (status === 429) {
      return "rate_limited";
    }
    if (status >= 400 && status < 500) {
      return "validation_error";
    }
  }

  if (error instanceof Error) {
    return "network_error";
  }

  return "unknown_error";
}

/**
 * 공급자별 이벤트 전송을 감싸는 클라이언트 헬퍼.
 * 추후 도구를 교체해도 호출부는 이 파일의 API만 사용하도록 유지합니다.
 */
export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (!IS_ANALYTICS_ENABLED || ANALYTICS_PROVIDER !== "ga4") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.gtag?.("event", eventName, params);
}

/**
 * App Router 전환 시 페이지뷰를 수동 전송합니다.
 * GA4 자동 page_view를 비활성화한 상태를 전제로 합니다.
 */
export function trackPageView(path: string): void {
  if (!IS_ANALYTICS_ENABLED || ANALYTICS_PROVIDER !== "ga4") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.gtag?.("event", "page_view", {
    page_location: window.location.href,
    page_path: path,
    send_to: GA4_MEASUREMENT_ID,
  });
}
