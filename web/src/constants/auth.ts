import type { UserRole } from "@/schema/user/user-role";
import type { UserStatus } from "@/schema/user/user-status";

/**
 * 경로별 허용 권한 매핑 (middleware.ts에서 사용)
 */
export const ROLE_MAP: Record<string, string> = {
  "/admin": "ADMIN",
  "/study": "STUDENT",
  "/teach": "TEACHER",
};

/**
 * 역할별 로그인 후 리다이렉트 경로
 */
export const ROLE_REDIRECT_MAP: Record<string, string> = {
  STUDENT: "/study",
  TEACHER: "/teach",
  ADMIN: "/admin",
};

/**
 * 인증 모달 타입
 */
export const MODAL_TYPES = {
  SIGN_IN: "signin",
  SIGN_UP: "signup",
} as const;

/**
 * 사용자 역할 한글 명칭
 */
export const USER_ROLE_NAMES: Record<UserRole, string> = {
  STUDENT: "학생",
  TEACHER: "강사",
  ADMIN: "관리자",
};

/**
 * 사용자 상태 한글 명칭
 */
export const USER_STATUS_NAMES: Record<UserStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

/**
 * 사용자 역할 색상 (Tailwind 클래스)
 */
export const USER_ROLE_COLORS: Record<UserRole, string> = {
  STUDENT: "bg-primary/10 text-primary",
  TEACHER: "bg-secondary text-secondary-foreground",
  ADMIN: "bg-accent text-accent-foreground",
};

/**
 * 사용자 상태 색상 (Tailwind 클래스)
 */
export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE: "bg-primary/10 text-primary",
  INACTIVE: "bg-destructive/10 text-destructive",
};

/**
 * 세션 만료 시간 (초 단위)
 */
export const SESSION_EXPIRES_IN = 60 * 60 * 24 * 7; // 7일

/**
 * 쿠키 캐시 유지 시간 (초 단위)
 */
export const COOKIE_CACHE_MAX_AGE = 5 * 60; // 5분

/**
 * 기본 사용자 역할
 */
export const DEFAULT_USER_ROLE = "STUDENT" as const;

/**
 * 기본 사용자 상태
 */
export const DEFAULT_USER_STATUS = "ACTIVE" as const;

/**
 * 데이터베이스 연결 풀 최대 크기
 */
export const DATABASE_POOL_MAX = 10;
