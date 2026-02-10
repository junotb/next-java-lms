import { z } from "zod";

export const ScheduleStatusSchema = z.enum([
  "SCHEDULED",
  "ATTENDED",
  "ABSENT",
  "CANCELLED",
]);

export type ScheduleStatus = z.infer<typeof ScheduleStatusSchema>;
