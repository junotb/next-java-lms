import { z } from "zod";

export const ProfileUpdateRequestSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력하세요.")
    .max(50, "이름은 50자 이하여야 합니다."),
  image: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.trim() === "" || /^https?:\/\//.test(v.trim()),
      "유효한 URL을 입력하세요 (http:// 또는 https://)"
    ),
});

export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateRequestSchema>;
