"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

const TOUCH_TARGET_CLASS = "min-w-11 min-h-11 touch-manipulation";

/**
 * 로그인 상태의 사용자 메뉴 (설정, 로그아웃 등).
 * md(768px) 이하에서는 variant와 무관하게 compact(아이콘 중심)로 렌더.
 */
export default function HeaderUserMenu({
  user,
  showDashboardLink = true,
  variant = "default",
}: HeaderUserMenuProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const effectiveVariant = isMobile ? "compact" : variant;

  const dashboardPath = user.role
    ? ROLE_REDIRECT_MAP[user.role as UserRole]
    : undefined;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = user.name || user.email || "사용자";

  if (effectiveVariant === "compact") {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {showDashboardLink && dashboardPath && (
          <Button variant="ghost" size="sm" asChild className={TOUCH_TARGET_CLASS}>
            <a href={dashboardPath}>내 대시보드</a>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={`text-muted-foreground hover:text-foreground ${TOUCH_TARGET_CLASS}`}
        >
          <Link href="/settings/profile" aria-label="설정">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className={`text-muted-foreground hover:text-foreground ${TOUCH_TARGET_CLASS}`}
          aria-label="로그아웃"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {showDashboardLink && dashboardPath && (
        <Button variant="ghost" size="sm" asChild className={TOUCH_TARGET_CLASS}>
          <a href={dashboardPath}>내 대시보드</a>
        </Button>
      )}
      <Button variant="ghost" size="sm" asChild className={TOUCH_TARGET_CLASS}>
        <Link href="/settings/profile" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          설정
        </Link>
      </Button>
      <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span className="max-w-32 truncate" title={displayName}>
          {displayName}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className={`text-muted-foreground hover:text-foreground ${TOUCH_TARGET_CLASS}`}
      >
        <LogOut className="mr-1 h-4 w-4" />
        로그아웃
      </Button>
    </div>
  );
}
