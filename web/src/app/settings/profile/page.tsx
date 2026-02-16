import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSettingsPath } from "@/lib/routes";
import type { UserRole } from "@/schemas/user/user-role";

/**
 * 기존 /settings/profile URL 호환.
 */
export default async function LegacyProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const role = session.user.role as UserRole;
  redirect(`${getSettingsPath(role)}/profile`);
}
