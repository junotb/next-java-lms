import { z } from "zod";

export const RegistrationStatusSchema = z.enum(["REGISTERED", "CANCELED"]);
export type RegistrationStatus = z.infer<typeof RegistrationStatusSchema>;

export const RegistrationSchema = z.object({
  id: z.number(),
  scheduleId: z.number(),
  studentId: z.string(),
  status: RegistrationStatusSchema,
  registeredAt: z.string(),
});

export type Registration = z.infer<typeof RegistrationSchema>;
