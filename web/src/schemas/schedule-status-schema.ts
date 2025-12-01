import { z } from "zod";

export const scheduleStatusSchema = z.enum([
  "SCHEDULED",
  "ATTENDED",
  "ABSENT",
  "CANCELLED",
]);

export type ScheduleStatus = z.infer<typeof scheduleStatusSchema>;
