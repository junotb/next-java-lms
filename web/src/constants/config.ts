/**
 * 애플리케이션 설정 상수.
 * DB 풀, TanStack Query 캐시 등 인프라 관련 값을 중앙 관리.
 */

/** Better Auth 데이터베이스 연결 풀 최대 크기 (lib/auth.ts에서 사용) */
export const DATABASE_POOL_MAX = 10;

/** TanStack Query 목록/대시보드 데이터 staleTime (5분, ms) */
export const STALE_TIME_LIST = 5 * 60 * 1000;

/** TanStack Query 통계/집계 데이터 staleTime (10분, ms) */
export const STALE_TIME_STATS = 10 * 60 * 1000;
