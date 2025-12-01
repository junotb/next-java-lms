import { z } from "zod";

export const userStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
]);

export type UserStatus = z.infer<typeof userStatusSchema>;
