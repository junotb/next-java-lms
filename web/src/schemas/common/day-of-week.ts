import { z } from "zod";

// TypeScript native enum
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Zod schema
export const DayOfWeekSchema = z.nativeEnum(DayOfWeek);

// UI 헬퍼 함수: Enum → 한글 요일명 변환
export function getDayOfWeekName(day: DayOfWeek): string {
  const names: Record<DayOfWeek, string> = {
    [DayOfWeek.MONDAY]: "월요일",
    [DayOfWeek.TUESDAY]: "화요일",
    [DayOfWeek.WEDNESDAY]: "수요일",
    [DayOfWeek.THURSDAY]: "목요일",
    [DayOfWeek.FRIDAY]: "금요일",
    [DayOfWeek.SATURDAY]: "토요일",
    [DayOfWeek.SUNDAY]: "일요일",
  };
  return names[day];
}

// UI 헬퍼 함수: Enum → 짧은 요일명 변환 (예: "월", "화")
export function getDayOfWeekShortName(day: DayOfWeek): string {
  const names: Record<DayOfWeek, string> = {
    [DayOfWeek.MONDAY]: "월",
    [DayOfWeek.TUESDAY]: "화",
    [DayOfWeek.WEDNESDAY]: "수",
    [DayOfWeek.THURSDAY]: "목",
    [DayOfWeek.FRIDAY]: "금",
    [DayOfWeek.SATURDAY]: "토",
    [DayOfWeek.SUNDAY]: "일",
  };
  return names[day];
}

// 모든 요일 배열 (월요일부터 일요일까지)
export const ALL_DAYS_OF_WEEK: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];
