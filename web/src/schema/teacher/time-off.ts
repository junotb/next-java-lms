import { z } from "zod";

export const TeacherTimeOffTypeSchema = z.enum([
  "VACATION",
  "SICK_LEAVE",
  "PUBLIC_HOLIDAY",
]);
export type TeacherTimeOffType = z.infer<typeof TeacherTimeOffTypeSchema>;

export const TeacherTimeOffRequestSchema = z
  .object({
    startDateTime: z.date({ message: "시작 일시를 선택하세요." }),
    endDateTime: z.date({ message: "종료 일시를 선택하세요." }),
    type: TeacherTimeOffTypeSchema,
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDateTime >= data.endDateTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endDateTime"],
        message: "종료 일시는 시작 일시보다 이후여야 합니다.",
      });
    }
  });

export type TeacherTimeOffRequest = z.infer<typeof TeacherTimeOffRequestSchema>;

export const TeacherTimeOffResponseSchema = z.object({
  id: z.number(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  type: TeacherTimeOffTypeSchema,
  reason: z.string().nullable(),
});
export type TeacherTimeOffResponse = z.infer<typeof TeacherTimeOffResponseSchema>;

export const TeacherTimeOffFormValuesSchema = TeacherTimeOffRequestSchema;
export type TeacherTimeOffFormValues = z.infer<
  typeof TeacherTimeOffFormValuesSchema
>;

export const TEACHER_TIME_OFF_TYPE_LABELS: Record<TeacherTimeOffType, string> = {
  VACATION: "휴가",
  SICK_LEAVE: "병가",
  PUBLIC_HOLIDAY: "공휴일",
};
