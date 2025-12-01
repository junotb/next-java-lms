import { apiFetch } from "@/libs/client";
import { UserFilter } from "@/schemas/user-filter-schema";
import { UserSchema, User } from "@/schemas/user-schema";

export async function getUsers(userFilter: UserFilter): Promise<User[]> {
  const params = new URLSearchParams();

  params.set("role", userFilter.role);
  params.set("status", userFilter.status);

  if (userFilter.firstName) params.set("firstName", userFilter.firstName);
  if (userFilter.lastName) params.set("lastName", userFilter.lastName);

  const queryString = params.toString();
  const users = await apiFetch<User[]>(`/api/user?${queryString}`);
  return UserSchema.array().parse(users);
}