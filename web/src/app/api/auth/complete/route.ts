import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ROLE_REDIRECT_MAP } from "@/constants/auth";
import type { UserRole } from "@/schemas/user/user-role";

/**
 * OAuth 콜백 후 역할 기반 리다이렉트.
 * Better Auth가 callbackURL로 리다이렉트할 때 이 핸들러가 실행되며,
 * 세션의 역할에 맞는 경로(/study, /teach, /admin)로 보냅니다.
 */
export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const role = session?.user?.role as UserRole | undefined;
  const path = role ? ROLE_REDIRECT_MAP[role] : "/";

  return NextResponse.redirect(new URL(path, request.url));
}
