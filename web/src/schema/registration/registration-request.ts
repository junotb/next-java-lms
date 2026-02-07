import { z } from "zod";

export const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const CourseRegistrationSchema = z.object({
  courseId: z.number().int().positive("강좌를 선택해주세요."),
  months: z.number().int().positive(), // 1, 3, 6, 12
  days: z
    .array(z.enum(DAYS_OF_WEEK))
    .min(1, "희망 요일을 최소 1개 이상 선택해주세요."),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "HH:MM 형식이어야 합니다."),
  durationMinutes: z.number().int().positive(),
});

export type CourseRegistrationRequest = z.infer<typeof CourseRegistrationSchema>;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
