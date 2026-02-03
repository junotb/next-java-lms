import api from "@/lib/api";
import { PageResponseSchema } from "@/schema/common/page-response";
import { User, UserSchema, UserCreateRequest, UserProfileUpdateRequest, UserListRequest, UserPasswordUpdateRequest } from "@/schema/user/user";
import { UserRole } from "@/schema/user/user-role";
import { UserStatus } from "@/schema/user/user-status";

// 사용자 목록 조회
export async function userList(params: UserListRequest): Promise<User[]> {
  try {
    const response = await api.get<User[]>("/api/v1/user", { params });
    return PageResponseSchema(UserSchema).parse(response.data).items;
  } catch (error) {
    console.error("Error get users:", error);
    throw error;
  }
}

// 사용자 정보 조회
export async function userProfile(userId: string): Promise<User> {
  try {
    const response = await api.get<User>(`/api/v1/user/${userId}`);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error("Error get user profile:", error);
    throw error;
  }
}

// 사용자 등록
export async function userCreate(payload: UserCreateRequest): Promise<User> {
  try {
    const response = await api.post<User>("/api/v1/user", payload);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error("Error create user:", error);
    throw error;
  }
}

// 사용자 정보 수정
export async function userProfileUpdate(userId: string, payload: UserProfileUpdateRequest): Promise<User> {
  try {
    const response = await api.patch<User>(`/api/v1/user/${userId}`, payload);
    return UserSchema.parse(response.data);
  } catch (error) {
    console.error("Error update user:", error);
    throw error;
  }
}

// 사용자 비밀번호 수정
export async function userPasswordUpdate(userId: string, payload: UserPasswordUpdateRequest): Promise<void> {
  try {
    await api.patch<void>(`/api/v1/user/${userId}/password`, payload);
  } catch (error) {
    console.error("Error update user password:", error);
    throw error;
  }
}

// 사용자 삭제
export async function userDelete(userId: string): Promise<void> {
  try {
    await api.delete<void>(`/api/v1/user/${userId}`);
  } catch (error) {
    console.error("Error delete user:", error);
    throw error;
  }
}

// 사용자 역할별 통계
export async function userRoleStats(): Promise<Record<UserRole, number>> {
  try {
    const response = await api.get<Record<UserRole, number>>("/api/v1/user/stats/role");
    return response.data;
  } catch (error) {
    console.error("Error get user role stats:", error);
    throw error;
  }
}

// 사용자 역할명 변환
export function getUserRoleName(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "관리자";
    case "TEACHER":
      return "강사";
    case "STUDENT":
      return "학생";
    default:
      return "알 수 없음";
  }
}

// 사용자 상태명 변환
export function getUserStatusName(status: UserStatus): string {
  switch (status) {
    case "ACTIVE":
      return "활성";
    case "INACTIVE":
      return "비활성";
    default:
      return "알 수 없음";
  }
}

