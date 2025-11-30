import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;
