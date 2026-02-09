import { z } from "zod";

export const LessonFeedbackStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);

export const LessonFeedbackResponseSchema = z.object({
  scheduleId: z.number(),
  courseTitle: z.string().nullable(),
  startsAt: z.string(),
  endsAt: z.string(),
  vttContent: z.string().nullable(),
  feedbackContent: z.string().nullable(),
  feedbackStatus: LessonFeedbackStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VideoUploadResponseSchema = z.object({
  lessonFeedbackId: z.number(),
  status: z.string(),
});

export type LessonFeedbackResponse = z.infer<typeof LessonFeedbackResponseSchema>;
export type VideoUploadResponse = z.infer<typeof VideoUploadResponseSchema>;
export type LessonFeedbackStatus = z.infer<typeof LessonFeedbackStatusSchema>;
