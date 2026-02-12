import { z } from "zod";
import { UserRoleSchema } from "@/schemas/user/user-role";
import { UserStatusSchema } from "@/schemas/user/user-status";

// 사용자 스키마
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  role: UserRoleSchema,
  status: UserStatusSchema,
});

export type User = z.infer<typeof UserSchema>;

// 사용자 생성 요청 스키마
export const UserCreateRequestSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  name: z.string().min(1, "이름을 입력하세요."),
  role: UserRoleSchema,
  status: UserStatusSchema,
});

export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>;

// 사용자 수정 요청 스키마
export const UserProfileUpdateRequestSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력하세요."),
  name: z.string().min(1, "이름을 입력하세요."),
  role: UserRoleSchema,
  status: UserStatusSchema,
});

export type UserProfileUpdateRequest = z.infer<typeof UserProfileUpdateRequestSchema>;

// 사용자 조회 요청
export type UserProfileRequest = {
  email: string;
  password: string;
};

// 사용자 목록 요청 스키마
export const UserListRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: UserRoleSchema.optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  status: UserStatusSchema.optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

export type UserListRequest = z.infer<typeof UserListRequestSchema>;

// 사용자 생성 폼 타입
export type UserCreateFormValues = UserCreateRequest;

// 사용자 수정 폼 타입
export type UserProfileUpdateFormValues = UserProfileUpdateRequest;

// 사용자 조회 폼 타입
export type UserProfileFormValues = UserProfileRequest;

// 사용자 목록 폼 타입 (폼 입력은 "" 허용)
export type UserListFormValues = z.input<typeof UserListRequestSchema>;
