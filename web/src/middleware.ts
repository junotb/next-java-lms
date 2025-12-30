// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  /*
  // 1. 공용 페이지(로그인, 가입 등) 접근 시
  if (pathname === "/") {
    if (token) {
      // 이미 토큰이 있다면 메인으로 리다이렉트
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // 2. 보호된 경로 접근 시 토큰 확인
  if (!token) {
    const loginUrl = new URL("/", request.url);
    // 원래 가려던 주소를 쿼리 파라미터로 저장 (로그인 후 복귀용)
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 3. JWT 검증 및 페이로드 확인
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 4. Role 기반 접근 제어 (넥스랭 핵심 로직)
    if (pathname.startsWith("/teach") && payload.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/study", request.url));
    }
    
    if (pathname.startsWith("/admin") && payload.role !== "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/study", request.url));
    }

    // 검증 성공 시 요청 진행
    return NextResponse.next();
  } catch (error) {
    // 토큰이 변조되었거나 만료된 경우 쿠키 삭제 후 로그인 이동
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
  */

  // 현재는 모든 요청을 그냥 통과시킴
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
  ],
};