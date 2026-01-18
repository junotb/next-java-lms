import { z } from "zod";
import {
  ScheduleStatus,
  ScheduleStatusSchema,
} from "@/schema/schedule/schedule-status";

// 스케줄 스키마
export const ScheduleSchema = z
  .object({
    id: z.number().int().positive(),
    userId: z.string(),
    startsAt: z.string(),
    endsAt: z.string(),
    status: ScheduleStatusSchema,
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

// 스케줄 생성 요청
export type ScheduleCreateRequest = {
  userId: string;
  startsAt: string;
  endsAt: string;
  status: ScheduleStatus;
};

// 스케줄 수정 요청
export type ScheduleUpdateRequest = {
  userId: string;
  startsAt: string;
  endsAt: string;
  status: ScheduleStatus;
};

// 스케줄 목록 요청
export type ScheduleListRequest = {
  userId?: string;
  status?: ScheduleStatus;
};

// 스케줄 생성 폼 타입
export type ScheduleCreateFormValues = ScheduleCreateRequest;

// 스케줄 수정 폼 타입
export type ScheduleUpdateFormValues = ScheduleUpdateRequest;

// 스케줄 목록 폼 타입
export type ScheduleListFormValues = ScheduleListRequest;
