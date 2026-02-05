import { z } from "zod";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";

export const ScheduleSummarySchema = z.object({
  id: z.number(),
  userId: z.string(),
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
  todayClassCount: z.number(),
  upcomingClassCount: z.number(),
});

export const TeachDashboardResponseSchema = z.object({
  nextClass: DashboardNextClassSchema.nullable(),
  stats: TeachDashboardStatsSchema,
  todaySchedules: z.array(ScheduleSummarySchema),
});

export type DashboardNextClass = z.infer<typeof DashboardNextClassSchema>;
export type StudyDashboardResponse = z.infer<typeof StudyDashboardResponseSchema>;
export type TeachDashboardResponse = z.infer<typeof TeachDashboardResponseSchema>;
export type DashboardScheduleItem = z.infer<typeof ScheduleSummarySchema>;
