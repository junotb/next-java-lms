/**
 * Better-Auth 세션 타입 정의
 * Better-Auth의 getSession() 응답 구조를 명확히 정의합니다.
 */
export interface BetterAuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    [key: string]: unknown;
  };
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
