"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import HeaderUserMenu from "@/component/common/HeaderUserMenu";

export default function StudyHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const navItems = [
    { href: "/study", label: "대시보드" },
    { href: "/study/registration", label: "수업 신청" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex items-center justify-between px-4 h-16 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="font-bold">NexLang</h1>
        </Link>
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/study" && pathname.startsWith(item.href));
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
