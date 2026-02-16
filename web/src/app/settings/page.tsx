import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSettingsPath } from "@/lib/routes";
import type { UserRole } from "@/schemas/user/user-role";

/**
 * 기존 /settings URL 호환. 세션 기반으로 역할별 설정 경로로 리다이렉트.
 */
export default async function LegacySettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const role = session.user.role as UserRole;
  redirect(`${getSettingsPath(role)}/profile`);
}
