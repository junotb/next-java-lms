import { NextRequest, NextResponse } from "next/server";
import { getCookieCache } from "better-auth/cookies";
import { ROLE_MAP } from "@/constants/auth";

export async function middleware(request: NextRequest) {
  const session = await getCookieCache(request);
  const { pathname } = request.nextUrl;

  // 2. 현재 접속한 경로가 ROLE_MAP에 정의된 경로로 시작하는지 확인
  const matchedPath = Object.keys(ROLE_MAP).find((path) =>
    pathname.startsWith(path)
  );

  if (matchedPath) {
    const requiredRole = ROLE_MAP[matchedPath];

    // 3. 세션이 없거나, 유저의 역할이 요구되는 역할과 일치하지 않는 경우
    if (!session || session.user.role !== requiredRole) {
      // 권한 없음 페이지 또는 메인으로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // /settings: 로그인 필수
  if (pathname.startsWith("/settings")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // /feedback: 강사 또는 학생만 접근 (세션 필수)
  if (pathname.startsWith("/feedback")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const role = session.user.role;
    if (role !== "TEACHER" && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// 매처(Matcher) 설정: Next.js 15 권장 방식
export const config = {
  matcher: [
    /*
     * 모든 경로를 검사하되 아래 파일들은 제외:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico, public 폴더 내 이미지들
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icon|api).*)",
    "/admin/:path*",
    "/study/:path*",
    "/teach/:path*",
    "/feedback/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
