import { z } from "zod";

export const userRoleSchema = z.enum([
  "STUDENT",
  "TEACHER",
  "ADMINISTRATOR",
]);

export type UserRole = z.infer<typeof userRoleSchema>;