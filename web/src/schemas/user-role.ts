import { z } from "zod";

export const UserRole = z.enum([
  "STUDENT",
  "TEACHER",
  "ADMINISTRATOR",
], {
  error: "유효하지 않은 사용자 역할입니다."
});

export type UserRole = z.infer<typeof UserRole>;