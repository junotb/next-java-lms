import api from "@/lib/api";
import { USER_ROLE_NAMES, USER_STATUS_NAMES } from "@/constants/auth";
import { PageResponseSchema } from "@/schemas/common/page-response";
import { User, UserSchema, UserCreateRequest, UserProfileUpdateRequest, UserListRequest } from "@/schemas/user/user";
import { UserRole } from "@/schemas/user/user-role";
import { UserStatus } from "@/schemas/user/user-status";

// 사용자 목록 조회
export async function userList(params: UserListRequest): Promise<User[]> {
  const response = await api.get<User[]>("/api/v1/user", { params });
  return PageResponseSchema(UserSchema).parse(response.data).items;
}

// 사용자 정보 조회
export async function userProfile(userId: string): Promise<User> {
  const response = await api.get<User>(`/api/v1/user/${userId}`);
  return UserSchema.parse(response.data);
}

// 사용자 등록
export async function userCreate(payload: UserCreateRequest): Promise<User> {
  const response = await api.post<User>("/api/v1/user", payload);
  return UserSchema.parse(response.data);
}

// 사용자 정보 수정
export async function userProfileUpdate(
  userId: string,
  payload: UserProfileUpdateRequest
): Promise<User> {
  const response = await api.patch<User>(`/api/v1/user/${userId}`, payload);
  return UserSchema.parse(response.data);
}

// 사용자 삭제
export async function userDelete(userId: string): Promise<void> {
  await api.delete<void>(`/api/v1/user/${userId}`);
}

// 사용자 탈퇴
export async function withdraw(): Promise<void> {
  await api.post<void>("/api/v1/user/me/withdraw");
}

// 사용자 역할별 통계
export async function userRoleStats(): Promise<Record<UserRole, number>> {
  const response = await api.get<Record<UserRole, number>>(
    "/api/v1/user/stats/role"
  );
  return response.data;
}

/**
 * 사용자 역할 한글 명칭.
 * constants/auth USER_ROLE_NAMES 기반, fallback 처리.
 */
export function getUserRoleName(role: UserRole): string {
  return USER_ROLE_NAMES[role] ?? "알 수 없음";
}

/**
 * 사용자 상태 한글 명칭.
 * constants/auth USER_STATUS_NAMES 기반, fallback 처리.
 */
export function getUserStatusName(status: UserStatus): string {
  return USER_STATUS_NAMES[status] ?? "알 수 없음";
}

