import { z } from "zod";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";

const ScheduleInLessonSchema = z.object({
  id: z.number(),
  userId: z.string(),
  courseId: z.number().nullable().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: ScheduleStatusSchema,
  meetLink: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LessonAccessResponseSchema = z.object({
  allowed: z.boolean(),
  role: z.string(),
  schedule: ScheduleInLessonSchema,
  meetLink: z.string().nullable(),
});

export type LessonAccessResponse = z.infer<typeof LessonAccessResponseSchema>;
export type ScheduleInLesson = z.infer<typeof ScheduleInLessonSchema>;
