import { z } from "zod";
import { UserRole } from "@/schemas/user-role";
import { UserStatus } from "@/schemas/user-status";

// 사용자 스키마
export const User = z.object({
  id: z.number().int().positive(),
  username: z.string().min(6),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  role: UserRole,
  status: UserStatus
});

export type User = z.infer<typeof User>;

// 사용자 등록 요청
export const UserCreateRequest = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: UserRole,
  status: UserStatus
});

export type UserCreateRequest = z.infer<typeof UserCreateRequest>;

// 사용자 수정 요청
export const UserProfileUpdateRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: UserRole,
  status: UserStatus
});

export type UserProfileUpdateRequest = z.infer<typeof UserProfileUpdateRequest>;

// 사용자 비밀번호 수정 요청
export const UserPasswordModifyRequest = z.object({
  id: z.number().int().positive(),
  password: z.string()
});

export type UserPasswordModifyRequest = z.infer<typeof UserPasswordModifyRequest>;

// 사용자 삭제 요청
export const UserDeleteRequest = z.object({
  id: z.number().int().positive()
});

export type UserDeleteRequest = z.infer<typeof UserDeleteRequest>;

// 사용자 목록 요청
export const UserListRequest = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  role: UserRole.nullable(),
  status: UserStatus.nullable(),
});

export type UserListRequest = z.infer<typeof UserListRequest>;