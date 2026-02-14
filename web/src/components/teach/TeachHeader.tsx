"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import HeaderNavSheet from "@/components/common/HeaderNavSheet";

const NAV_ITEMS = [
  { href: "/teach", label: "대시보드" },
  { href: "/teach/availability", label: "가용 시간" },
  { href: "/teach/time-off", label: "휴무일" },
] as const;

export default function TeachHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const getIsActive = (item: { href: string; label: string }) =>
    pathname === item.href ||
    (item.href !== "/teach" && pathname.startsWith(item.href));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-16 w-full max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <HeaderNavSheet
            navItems={[...NAV_ITEMS]}
            getIsActive={getIsActive}
          />
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="font-bold">NexLang</h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_ITEMS.map((item) => {
            const isActive = getIsActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center transition-colors",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {session?.user && (
          <HeaderUserMenu user={session.user} showDashboardLink={false} />
        )}
      </div>
    </header>
  );
}
