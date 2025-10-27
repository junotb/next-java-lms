import TeacherList from "@/components/teachers/TeacherList";
import { apiFetch } from "@/libs/client";
import { Teacher } from "@/types/teacher";

async function fetchTeachers(): Promise<Teacher[]> {
  return await apiFetch("/api/teachers", {
    cache: "no-store",
  });
}

export default async function HomePage() {
  const teachers = await fetchTeachers();
  return (
    <main className="flex min-h-screen flex-col gap-8 justify-center items-center">
      <h1 className="text-2xl font-semibold">강사 목록</h1>
      <TeacherList teachers={teachers} basePath="/teachers" />
    </main>
  );
}
