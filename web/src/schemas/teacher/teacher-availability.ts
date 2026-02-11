import { z } from "zod";
import { DayOfWeek, DayOfWeekSchema } from "@/schemas/common/day-of-week";

// 개별 요일 가용 시간 스키마
export const DayAvailabilitySchema = z
  .object({
    dayOfWeek: DayOfWeekSchema,
    enabled: z.boolean(),
    startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "시간 형식이 올바르지 않습니다. (HH:mm)",
    }),
    endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "시간 형식이 올바르지 않습니다. (HH:mm)",
    }),
  })
  .superRefine((data, ctx) => {
    // enabled가 true일 때만 시간 유효성 검사 수행
    if (!data.enabled) {
      return;
    }

    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (startMinutes >= endMinutes) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "종료 시간은 시작 시간보다 이후여야 합니다.",
      });
    }
  });

export type DayAvailability = z.infer<typeof DayAvailabilitySchema>;

// 강사 가용 시간 설정 스키마 (7개 요일)
export const TeacherAvailabilitySchema = z.object({
  availabilities: z.array(DayAvailabilitySchema).length(7),
});

export type TeacherAvailability = z.infer<typeof TeacherAvailabilitySchema>;

// 강사 가용 시간 설정 요청
export type TeacherAvailabilityRequest = {
  availabilities: DayAvailability[];
};

// 강사 가용 시간 설정 폼 타입
export type TeacherAvailabilityFormValues = TeacherAvailabilityRequest;

// API 응답 타입 (서버에서 받는 데이터)
export const TeacherAvailabilityResponseSchema = z.object({
  id: z.number(),
  dayOfWeek: DayOfWeekSchema,
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "시간 형식이 올바르지 않습니다. (HH:mm)",
  }),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "시간 형식이 올바르지 않습니다. (HH:mm)",
  }),
});

export type TeacherAvailabilityResponse = z.infer<typeof TeacherAvailabilityResponseSchema>;

export { DayOfWeek };

