import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getClassroomPath } from "@/lib/routes";
import { USER_ROLE } from "@/constants/auth";
import type { UserRole } from "@/schemas/user/user-role";

interface LegacyClassroomPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 기존 /classroom/[id] URL 호환. TEACHER|STUDENT만 역할별 경로로 리다이렉트.
 */
export default async function LegacyClassroomPage({
  params,
}: LegacyClassroomPageProps) {
  const { id } = await params;
  const scheduleId = parseInt(id, 10);

  if (Number.isNaN(scheduleId)) {
    redirect("/");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const role = session.user.role as UserRole;
  if (role !== USER_ROLE.TEACHER && role !== USER_ROLE.STUDENT) {
    redirect("/");
  }

  redirect(getClassroomPath(role, scheduleId));
}
