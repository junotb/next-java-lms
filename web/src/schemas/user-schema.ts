import { z } from "zod";
import { userRoleSchema } from "./user-role-schema";
import { userStatusSchema } from "./user-status-schema";

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  role: userRoleSchema,
  status: userStatusSchema
});

export type User = z.infer<typeof UserSchema>;
