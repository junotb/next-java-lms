"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  CalendarRange,
  CalendarX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { getSettingsPath } from "@/lib/routes";
import type { UserRole } from "@/schemas/user/user-role";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import HeaderNavSheet from "@/components/common/HeaderNavSheet";

const NAV_ITEMS = [
  { href: "/teach", label: "대시보드", icon: LayoutDashboard },
  { href: "/teach/availability", label: "가용 시간", icon: CalendarRange },
  { href: "/teach/time-off", label: "휴무일", icon: CalendarX },
] as const;

export default function TeachHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const getIsActive = (item: { href: string; label: string }) =>
    pathname === item.href ||
    (item.href !== "/teach" && pathname.startsWith(item.href));

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const settingsPath = userRole ? getSettingsPath(userRole as UserRole) : undefined;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
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
            user={session?.user}
            settingsPath={settingsPath}
            onSignOut={handleSignOut}
          />
          {session?.user && (
            <div className="hidden md:block">
              <HeaderUserMenu user={session.user} showDashboardLink={false} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
