import { z } from "zod";
import { ScheduleStatusSchema } from "@/schemas/schedule/schedule-status";

// Meet 링크 수정 요청 스키마
export const ScheduleMeetLinkRequestSchema = z.object({
  meetLink: z.string().min(1, "Meet 링크를 입력하세요.").max(2048),
});
export type ScheduleMeetLinkRequest = z.infer<typeof ScheduleMeetLinkRequestSchema>;

// 수업 스키마
export const ScheduleSchema = z
  .object({
    id: z.number().int().positive(),
    userId: z.string(),
    courseId: z.number().int().positive().nullable().optional(),
    startsAt: z.string(),
    endsAt: z.string(),
    status: ScheduleStatusSchema,
    meetLink: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .superRefine((data, ctx) => {
    const starts = new Date(data.startsAt).toISOString();
    const ends = new Date(data.endsAt).toISOString();

    if (Number.isNaN(starts) || Number.isNaN(ends)) return;

    if (starts >= ends) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "종료 시간은 시작 시간보다 이후여야 합니다.",
      });
    }

    const created = new Date(data.createdAt).toISOString();
    const updated = new Date(data.updatedAt).toISOString();

    if (Number.isNaN(created) || Number.isNaN(updated)) return;

    if (created > updated) {
      ctx.addIssue({
        code: "custom",
        path: ["updatedAt"],
        message: "수정 시간은 생성 시간 이후여야 합니다.",
      });
    }
  });

export type Schedule = z.infer<typeof ScheduleSchema>;

// 수업 생성 요청 스키마
export const ScheduleCreateRequestSchema = z
  .object({
    userId: z.string().min(1, "강사 ID를 입력하세요."),
    startsAt: z.string().min(1, "시작 시간을 입력하세요."),
    endsAt: z.string().min(1, "종료 시간을 입력하세요."),
    status: ScheduleStatusSchema,
  })
  .superRefine((data, ctx) => {
    const starts = new Date(data.startsAt);
    const ends = new Date(data.endsAt);

    if (isNaN(starts.getTime()) || isNaN(ends.getTime())) return;

    if (starts >= ends) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "종료 시간은 시작 시간보다 이후여야 합니다.",
      });
    }
  });

export type ScheduleCreateRequest = z.infer<typeof ScheduleCreateRequestSchema>;

// 수업 수정 요청 스키마
export const ScheduleUpdateRequestSchema = z
  .object({
    userId: z.string().min(1, "강사 ID를 입력하세요."),
    startsAt: z.string().min(1, "시작 시간을 입력하세요."),
    endsAt: z.string().min(1, "종료 시간을 입력하세요."),
    status: ScheduleStatusSchema,
  })
  .superRefine((data, ctx) => {
    const starts = new Date(data.startsAt);
    const ends = new Date(data.endsAt);

    if (isNaN(starts.getTime()) || isNaN(ends.getTime())) return;

    if (starts >= ends) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "종료 시간은 시작 시간보다 이후여야 합니다.",
      });
    }
  });

export type ScheduleUpdateRequest = z.infer<typeof ScheduleUpdateRequestSchema>;

// 수업 목록 요청 스키마
export const ScheduleListRequestSchema = z.object({
  userId: z.string().optional(),
  status: ScheduleStatusSchema.optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

export type ScheduleListRequest = z.infer<typeof ScheduleListRequestSchema>;

// 수업 생성 폼 타입
export type ScheduleCreateFormValues = ScheduleCreateRequest;

// 수업 수정 폼 타입
export type ScheduleUpdateFormValues = ScheduleUpdateRequest;

// 수업 목록 폼 타입 (폼 입력은 "" 허용)
export type ScheduleListFormValues = z.input<typeof ScheduleListRequestSchema>;
