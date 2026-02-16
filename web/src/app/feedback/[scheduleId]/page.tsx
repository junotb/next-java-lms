import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getFeedbackPath } from "@/lib/routes";
import type { UserRole } from "@/schemas/user/user-role";

interface LegacyFeedbackPageProps {
  params: Promise<{ scheduleId: string }>;
}

/**
 * 기존 /feedback/[scheduleId] URL 호환. TEACHER|STUDENT만 역할별 경로로 리다이렉트.
 */
export default async function LegacyFeedbackPage({
  params,
}: LegacyFeedbackPageProps) {
  const { scheduleId } = await params;
  const id = parseInt(scheduleId, 10);

  if (Number.isNaN(id)) {
    redirect("/");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const role = session.user.role as UserRole;
  if (role !== "TEACHER" && role !== "STUDENT") {
    redirect("/");
  }

  redirect(getFeedbackPath(role, id));
}
