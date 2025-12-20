import api from "@/libs/api";
import { PageResponse } from "@/schemas/page-response";
import { User, UserCreateRequest, UserProfileUpdateRequest, UserListRequest, UserPasswordUpdateRequest } from "@/schemas/user";

// 사용자 목록 조회
export async function userList(params: UserListRequest): Promise<User[]> {
  try {
    const response = await api.get<User[]>("/api/user", { params });
    console.log(response.data);
    return PageResponse(User).parse(response.data).items;
  } catch (error) {
    console.error("Error get users:", error);
    throw error;
  }
}

// 사용자 정보 조회
export async function userProfile(userId: number): Promise<User> {
  try {
    const response = await api.get<User>(`/api/user/${userId}`);
    return User.parse(response.data);
  } catch (error) {
    console.error("Error get user profile:", error);
    throw error;
  }
}

// 사용자 등록
export async function userCreate(payload: UserCreateRequest): Promise<User> {
  try {
    const response = await api.post<User>("/api/user", payload);
    return User.parse(response.data);
  } catch (error) {
    console.error("Error create user:", error);
    throw error;
  }
}

// 사용자 정보 수정
export async function userProfileUpdate(userId: number, payload: UserProfileUpdateRequest): Promise<User> {
  try {
    const response = await api.patch<User>(`/api/user/${userId}`, payload);
    return User.parse(response.data);
  } catch (error) {
    console.error("Error update user:", error);
    throw error;
  }
}

// 사용자 비밀번호 수정
export async function userPasswordUpdate(userId: number, payload: UserPasswordUpdateRequest): Promise<void> {
  try {
    await api.patch<void>(`/api/user/${userId}/password`, payload);
  } catch (error) {
    console.error("Error update user password:", error);
    throw error;
  }
}

// 사용자 삭제
export async function userDelete(userId: number): Promise<void> {
  try {
    await api.delete<void>(`/api/user/${userId}`);
  } catch (error) {
    console.error("Error delete user:", error);
    throw error;
  }
}