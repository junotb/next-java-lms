import { z } from "zod";

export const ScheduleFeedbackStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

export const ScheduleFeedbackResponseSchema = z.object({
  scheduleId: z.number(),
  courseTitle: z.string().nullable(),
  startsAt: z.string(),
  endsAt: z.string(),
  vttContent: z.string().nullable(),
  feedbackContent: z.string().nullable(),
  feedbackStatus: ScheduleFeedbackStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VideoUploadResponseSchema = z.object({
  scheduleFeedbackId: z.number(),
  status: z.string(),
});

export type ScheduleFeedbackResponse = z.infer<typeof ScheduleFeedbackResponseSchema>;
export type VideoUploadResponse = z.infer<typeof VideoUploadResponseSchema>;
export type ScheduleFeedbackStatus = z.infer<typeof ScheduleFeedbackStatusSchema>;
