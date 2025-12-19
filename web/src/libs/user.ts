import api from "@/libs/api";
import { User, UserCreateRequest, UserProfileUpdateRequest, UserListRequest } from "@/schemas/user";

export async function userList(userFilter: UserListRequest): Promise<User[]> {
  try {
    const response = await api.get<User[]>("/api/user", { params: userFilter });
    return User.array().parse(response.data);
  } catch (error) {
    console.error("Error get users:", error);
    throw error;
  }
}

export async function userProfile(userId: number): Promise<User> {
  try {
    const response = await api.get<User>(`/api/user/${userId}`);
    return User.parse(response.data);
  } catch (error) {
    console.error("Error get user detail:", error);
    throw error;
  }
}

export async function userCreate(payload: UserCreateRequest): Promise<User> {
  try {
    const response = await api.post<User>("/api/user", payload);
    return User.parse(response.data);
  } catch (error) {
    console.error("Error register user:", error);
    throw error;
  }
}

export async function userProfileUpdate(userId: number, payload: UserProfileUpdateRequest): Promise<User> {
  try {
    const response = await api.patch<User>(`/api/user/${userId}`, payload);
    return User.parse(response.data);
  } catch (error) {
    console.error("Error modify user:", error);
    throw error;
  }
}

export async function userDelete(userId: number): Promise<void> {
  try {
    await api.delete<void>(`/api/user/${userId}`);
  } catch (error) {
    console.error("Error delete user:", error);
    throw error;
  }
}