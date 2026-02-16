import type { UserRole } from "@/schemas/user/user-role";

/**
 * Better Auth 세션의 user 객체 타입.
 * 컴포넌트 전반에서 session.user 캐스팅 없이 재사용.
 */
export interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
  status?: string;
  [key: string]: unknown;
}

/**
 * Better-Auth 세션 타입 정의
 * Better-Auth의 getSession() 응답 구조를 명확히 정의합니다.
 */
export interface BetterAuthSession {
  user: SessionUser;
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    [key: string]: unknown;
  };
}

export interface BetterAuthSessionResponse {
  data: BetterAuthSession | null;
}

/**
 * Better-Auth 에러 타입
 */
export type BetterError = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};
