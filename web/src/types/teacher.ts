import { z } from "zod";

export const TeacherSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
});

export type Teacher = z.infer<typeof TeacherSchema>;
