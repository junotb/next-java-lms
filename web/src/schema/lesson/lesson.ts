import { z } from "zod";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";
import { CourseSchema } from "@/schema/course/course";

const ScheduleInLessonSchema = z.object({
  id: z.number(),
  userId: z.string(),
  courseId: z.number().nullable().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: ScheduleStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LessonAccessResponseSchema = z.object({
  allowed: z.boolean(),
  role: z.string(),
  schedule: ScheduleInLessonSchema,
  course: CourseSchema.nullable(),
});

export type LessonAccessResponse = z.infer<typeof LessonAccessResponseSchema>;
export type ScheduleInLesson = z.infer<typeof ScheduleInLessonSchema>;
