import z from "zod";
import { userRoleSchema } from "@/schemas/user-role-schema";
import { userStatusSchema } from "@/schemas/user-status-schema";

export const UserFilterSchema = z.object({
  role: userRoleSchema,
  lastName: z.string().trim().optional(), 
  firstName: z.string().trim().optional(),
  status: userStatusSchema,
});

export type UserFilter = z.infer<typeof UserFilterSchema>;