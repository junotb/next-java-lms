import { z } from "zod";

export const UserStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
], {
  error: "유효하지 않은 사용자 상태입니다."
});

export type UserStatus = z.infer<typeof UserStatus>;
