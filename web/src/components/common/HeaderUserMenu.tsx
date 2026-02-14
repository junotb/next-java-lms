"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ROLE_REDIRECT_MAP } from "@/constants/auth";
import type { UserRole } from "@/schemas/user/user-role";

interface HeaderUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    [key: string]: unknown;
  };
  showDashboardLink?: boolean;
  variant?: "default" | "compact";
}

export default function HeaderUserMenu({
  user,
  showDashboardLink = true,
  variant = "default",
}: HeaderUserMenuProps) {
  const router = useRouter();
  const dashboardPath = user.role
    ? ROLE_REDIRECT_MAP[user.role as UserRole]
    : undefined;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = user.name || user.email || "사용자";

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        {showDashboardLink && dashboardPath && (
          <Button variant="ghost" size="sm" asChild>
            <a href={dashboardPath}>내 대시보드</a>
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings/profile" aria-label="설정">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
          aria-label="로그아웃"
        >
          <LogOut />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {showDashboardLink && dashboardPath && (
        <Button variant="ghost" size="sm" asChild>
          <a href={dashboardPath}>내 대시보드</a>
        </Button>
      )}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/settings/profile" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          설정
        </Link>
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span className="max-w-32 truncate" title={displayName}>
          {displayName}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="mr-1" />
        로그아웃
      </Button>
    </div>
  );
}
