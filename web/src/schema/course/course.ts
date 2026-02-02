import { z } from "zod";

export const CourseStatusSchema = z.enum(["OPEN", "CLOSED"]);
export type CourseStatus = z.infer<typeof CourseStatusSchema>;

export const CourseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: CourseStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;
