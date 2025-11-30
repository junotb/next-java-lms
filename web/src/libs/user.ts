import { UserSchema, type User } from "@/types/user";
import { apiFetch } from "@/libs/client";

export async function getUsers(role = 'TEACHER'): Promise<User[]> {
  const users = await apiFetch<User[]>(`/api/user?role=${role}`);
  return UserSchema.array().parse(users);
}