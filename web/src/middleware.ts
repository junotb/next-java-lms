import { NextRequest, NextResponse } from "next/server";
import { getCookieCache } from "better-auth/cookies";
import { ROLE_MAP } from "@/constants/auth";

/**
 * 역할별 라우트 보호. ROLE_MAP prefix 기반 검증만 수행.
 * settings·feedback·classroom은 역할 prefix 하위에 있으므로 예외 분기 없음.
 */
export async function middleware(request: NextRequest) {
  const session = await getCookieCache(request);
  const { pathname } = request.nextUrl;

  const matchedPath = Object.keys(ROLE_MAP).find((path) =>
    pathname.startsWith(path)
  );

  if (matchedPath) {
    const requiredRole = ROLE_MAP[matchedPath];

    if (!session || session.user.role !== requiredRole) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 기존 URL 호환: /settings, /feedback, /classroom — 로그인 필수
  if (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/feedback") ||
    pathname.startsWith("/classroom")
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icon|api).*)",
    "/admin/:path*",
    "/study/:path*",
    "/teach/:path*",
    "/settings/:path*",
    "/feedback/:path*",
    "/classroom/:path*",
    "/auth/:path*",
  ],
};
