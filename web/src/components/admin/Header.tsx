"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";

export default function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const navItems = [
    { href: "/admin", label: "대시보드" },
    { href: "/admin/user", label: "사용자" },
    { href: "/admin/course", label: "강의" },
    { href: "/admin/schedule", label: "스케줄" },
  ];

  return (
    <header className="sticky flex justify-center top-0 z-40 border-b w-full bg-background">
      <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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