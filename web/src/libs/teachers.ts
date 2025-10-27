import { TeacherSchema, type Teacher } from "@/types/teacher";
import { apiFetch } from "@/libs/client";

export async function getTeachers(): Promise<Teacher[]> {
  const teachers = await apiFetch<Teacher[]>("/api/teachers");
  return TeacherSchema.array().parse(teachers);
}