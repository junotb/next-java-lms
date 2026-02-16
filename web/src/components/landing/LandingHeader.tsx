"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LayoutDashboard, GraduationCap } from "lucide-react";
import { useMemo } from "react";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import HeaderNavSheet from "@/components/common/HeaderNavSheet";
import { ROLE_REDIRECT_MAP } from "@/constants/auth";
import { getSettingsPath } from "@/lib/routes";
import type { SessionUser } from "@/types/auth";

/**
 * 랜딩 페이지 상단 헤더.
 * 비로그인: 로그인 버튼, 로그인: 대시보드/설정/로그아웃.
 */
export default function LandingHeader() {
  const { openModal } = useAuthModalStore();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user as SessionUser | undefined;
  const userRole = user?.role;
  const dashboardPath = userRole
    ? ROLE_REDIRECT_MAP[userRole]
    : "/study";
  const settingsPath = userRole
    ? getSettingsPath(userRole)
    : undefined;

  const navItems = useMemo(
    () => [{ href: dashboardPath, label: "내 대시보드", icon: LayoutDashboard }],
    [dashboardPath]
  );

  const getIsActive = (item: { href: string }) =>
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <div className="flex items-center">
          {isPending ? (
            <div className="h-10 w-10 min-w-10 min-h-10 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              <HeaderNavSheet
                navItems={navItems}
                getIsActive={getIsActive}
                user={user}
                settingsPath={settingsPath}
                onSignOut={handleSignOut}
              />
              <div className="hidden md:block">
                <HeaderUserMenu user={user} showDashboardLink />
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModal("signin")}
              className="min-w-11 min-h-11 touch-manipulation text-muted-foreground hover:text-foreground"
              aria-label="로그인"
            >
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
