import { z } from "zod";
import { ScheduleStatus } from "@/schemas/schedule-status";

// 날짜-시간 로컬 문자열을 ISO 문자열로 변환
const datetimeLocalToIso = z.string().transform((value) => new Date(value).toISOString());
const datetimeLocalToIsoOptional = z.string().optional().transform((value) => value ? new Date(value).toISOString() : undefined);

// 스케줄 스키마
export const Schedule = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  startsAt: datetimeLocalToIso,
  endsAt: datetimeLocalToIso,
  status: ScheduleStatus,
  createdAt: datetimeLocalToIso,
  updatedAt: datetimeLocalToIso,
}).superRefine((data, ctx) => {
  const starts = new Date(data.startsAt).getTime();
  const ends = new Date(data.endsAt).getTime();
  
  if (Number.isNaN(starts) || Number.isNaN(ends)) return;

  if (starts >= ends) {
    ctx.addIssue({
      code: "custom",
      path: ["endsAt"],
      message: "종료 시간은 시작 시간보다 이후여야 합니다.",
    });
  }

  const created = new Date(data.createdAt).getTime();
  const updated = new Date(data.updatedAt).getTime();
  
  if (Number.isNaN(created) || Number.isNaN(updated)) return;

  if (created > updated) {
    ctx.addIssue({
      code: "custom",
      path: ["updatedAt"],
      message: "수정 시간은 생성 시간 이후여야 합니다.",
    });
  }
});

export type Schedule = z.infer<typeof Schedule>;

// 스케줄 생성 요청
export const ScheduleCreateRequest = z.object({
  userId: z.number().int().positive(),
  startsAt: datetimeLocalToIso,
  endsAt: datetimeLocalToIso,
  status: ScheduleStatus,
});

export type ScheduleCreateRequest = z.infer<typeof ScheduleCreateRequest>;

// 스케줄 수정 요청
export const ScheduleUpdateRequest = z.object({
  startsAt: datetimeLocalToIsoOptional,
  endsAt: datetimeLocalToIsoOptional,
  status: ScheduleStatus.optional(),
});

export type ScheduleUpdateRequest = z.infer<typeof ScheduleUpdateRequest>;

// 스케줄 목록 요청
export const ScheduleListRequest = z.object({
  userId: z.number().int().positive().nullable(),
  status: ScheduleStatus.nullable(),
});

export type ScheduleListRequest = z.infer<typeof ScheduleListRequest>;