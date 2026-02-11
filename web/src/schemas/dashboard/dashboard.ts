import { z } from "zod";
import { ScheduleStatusSchema } from "@/schemas/schedule/schedule-status";

export const ScheduleSummarySchema = z.object({
  id: z.number(),
  userId: z.string().nullable().optional(),
  courseId: z.number().nullable().optional(),
  courseTitle: z.string().nullable().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  status: ScheduleStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  instructorName: z.string().nullable().optional(),
  studentName: z.string().nullable().optional(),
});

export const DashboardNextClassSchema = z.object({
  scheduleId: z.number(),
  courseTitle: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  instructorName: z.string().nullable(),
  studentName: z.string().nullable(),
  meetLink: z.string().nullable().optional(),
});

export const StudyDashboardStatsSchema = z.object({
  activeCourseCount: z.number(),
  completedClassCount: z.number(),
});

export const StudyDashboardResponseSchema = z.object({
  nextClass: DashboardNextClassSchema.nullable(),
  stats: StudyDashboardStatsSchema,
  recentSchedules: z.array(ScheduleSummarySchema),
});

export const TeachDashboardStatsSchema = z.object({
  todayClassCount: z.coerce.number(),
  upcomingClassCount: z.coerce.number(),
});

export const TeachDashboardResponseSchema = z.object({
  nextClass: DashboardNextClassSchema.nullable(),
  stats: TeachDashboardStatsSchema,
  todaySchedules: z.array(ScheduleSummarySchema).default([]),
  recentCompletedSchedules: z.array(ScheduleSummarySchema).optional().default([]),
});

export type DashboardNextClass = z.infer<typeof DashboardNextClassSchema>;
export type StudyDashboardResponse = z.infer<typeof StudyDashboardResponseSchema>;
export type TeachDashboardResponse = z.infer<typeof TeachDashboardResponseSchema>;
export type DashboardScheduleItem = z.infer<typeof ScheduleSummarySchema>;
