import { z } from "zod";
import { UserRole, UserRoleSchema } from "@/schema/user/user-role";
import { UserStatus, UserStatusSchema } from "@/schema/user/user-status";

// 사용자 스키마
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  role: UserRoleSchema,
  status: UserStatusSchema
});

export type User = z.infer<typeof UserSchema>;

// 사용자 생성 요청
export type UserCreateRequest = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
};

// 사용자 수정 요청
export type UserProfileUpdateRequest = {
  name: string;
  role: UserRole;
  status: UserStatus;
};

// 사용자 비밀번호 수정 요청
export type UserPasswordUpdateRequest = {
  id: number;
  password: string;
};

// 사용자 조회 요청
export type UserProfileRequest = {
  email: string;
  password: string;
};

// 사용자 목록 요청
export type UserListRequest = {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
};

// 사용자 생성 폼 타입
export type UserCreateFormValues = UserCreateRequest;

// 사용자 수정 폼 타입
export type UserProfileUpdateFormValues = UserProfileUpdateRequest;

// 사용자 조회 폼 타입
export type UserProfileFormValues = UserProfileRequest;

// 사용자 목록 폼 타입
export type UserListFormValues = UserListRequest;