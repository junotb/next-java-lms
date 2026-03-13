/**
 * P0 CTA 추적 이벤트 상수와 공통 타입.
 * 공급자 전환 시에도 이벤트 의미를 유지하기 위해 중앙에서 관리합니다.
 */

export type AnalyticsRole = "guest" | "study" | "teach" | "admin";
export type AnalyticsResult = "success" | "fail";
export type AnalyticsErrorCode =
  | "validation_error"
  | "network_error"
  | "rate_limited"
  | "unknown_error";

export const ANALYTICS_EVENTS = {
  AUTH_SIGNIN_ATTEMPT: "auth_signin_attempt",
  AUTH_SIGNIN_RESULT: "auth_signin_result",
  AUTH_SIGNUP_ATTEMPT: "auth_signup_attempt",
  AUTH_SIGNUP_RESULT: "auth_signup_result",
  COURSE_REGISTRATION_ENTRY_CLICK: "course_registration_entry_click",
  COURSE_REGISTRATION_ATTEMPT: "course_registration_attempt",
  COURSE_REGISTRATION_RESULT: "course_registration_result",
  LESSON_ENTER_ATTEMPT: "lesson_enter_attempt",
  LESSON_ENTER_RESULT: "lesson_enter_result",
  WITHDRAW_ATTEMPT: "withdraw_attempt",
  WITHDRAW_RESULT: "withdraw_result",
} as const;
