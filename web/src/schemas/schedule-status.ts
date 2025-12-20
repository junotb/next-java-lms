import { z } from "zod";

export const ScheduleStatus = z.enum([
  "SCHEDULED",
  "ATTENDED",
  "ABSENT",
  "CANCELLED",
]);

export type ScheduleStatus = z.infer<typeof ScheduleStatus>;
