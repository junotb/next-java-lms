import { z } from "zod";
import { UserRole, UserRoleSchema } from "@/schemas/user/user-role";
import { UserStatus, UserStatusSchema } from "@/schemas/user/user-status";

// 사용자 스키마
export const UserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: UserRoleSchema,
  status: UserStatusSchema
});

export type User = z.infer<typeof UserSchema>;

// 사용자 생성 요청
export type UserCreateRequest = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

// 사용자 수정 요청
export type UserProfileUpdateRequest = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

// 사용자 비밀번호 수정 요청
export type UserPasswordUpdateRequest = {
  id: number;
  password: string;
};

// 사용자 목록 요청
export type UserListRequest = {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
};

// 사용자 생성 폼 타입
export type UserCreateFormValues = UserCreateRequest;

// 사용자 수정 폼 타입
export type UserProfileUpdateFormValues = UserProfileUpdateRequest;

// 사용자 목록 폼 타입
export type UserListFormValues = UserListRequest;