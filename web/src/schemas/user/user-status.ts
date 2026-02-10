import { z } from "zod";

export const UserStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export type UserStatus = z.infer<typeof UserStatusSchema>;
