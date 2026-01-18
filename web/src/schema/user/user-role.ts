import { z } from "zod";

export const UserRoleSchema = z.enum(["STUDENT", "TEACHER", "ADMIN"]);

export type UserRole = z.infer<typeof UserRoleSchema>;
