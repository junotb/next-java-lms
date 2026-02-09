import { DayOfWeek } from "@/schema/common/day-of-week";

/**
 * 수강 기간 옵션 (개월)
 */
export const MONTH_OPTIONS = [1, 3, 6, 12] as const;

/**
 * 수업 시간 옵션 (분)
 */
export const DURATION_OPTIONS = [30, 45, 60, 90] as const;

/**
 * 요일 한글 명칭
 */
export const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: "월",
  [DayOfWeek.TUESDAY]: "화",
  [DayOfWeek.WEDNESDAY]: "수",
  [DayOfWeek.THURSDAY]: "목",
  [DayOfWeek.FRIDAY]: "금",
  [DayOfWeek.SATURDAY]: "토",
  [DayOfWeek.SUNDAY]: "일",
};
