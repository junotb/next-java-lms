"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { getSettingsPath } from "@/lib/routes";
import type { SessionUser } from "@/types/auth";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import HeaderNavSheet from "@/components/common/HeaderNavSheet";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/user", label: "사용자", icon: Users },
  { href: "/admin/course", label: "강좌", icon: GraduationCap },
  { href: "/admin/schedule", label: "수업", icon: Calendar },
] as const;

/**
 * 관리자 영역 상단 헤더.
 * 대시보드, 사용자, 강좌, 수업 네비게이션 및 사용자 메뉴.
 */
export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const getIsActive = (item: { href: string; label: string }) =>
    pathname === item.href;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const user = session?.user as SessionUser | undefined;
  const settingsPath = user?.role ? getSettingsPath(user.role) : undefined;

  return (
    <header className="sticky top-0 z-40 flex w-full justify-center border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_ITEMS.map((item) => {
            const isActive = getIsActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center">
          <HeaderNavSheet
            navItems={NAV_ITEMS}
            getIsActive={getIsActive}
            user={user}
            settingsPath={settingsPath}
            onSignOut={handleSignOut}
          />
          {user && (
            <div className="hidden md:block">
              <HeaderUserMenu user={user} showDashboardLink={false} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
