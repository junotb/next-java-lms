import { z } from "zod";

export const ScheduleStatusSchema = z.enum([
  "SCHEDULED",
  "ATTENDED",
  "ABSENT",
  "CANCELED",
]);

export type ScheduleStatus = z.infer<typeof ScheduleStatusSchema>;
