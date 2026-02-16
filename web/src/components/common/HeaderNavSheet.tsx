"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Settings, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SessionUser } from "@/types/auth";

export interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
}

type HeaderNavSheetUser = Pick<SessionUser, "name" | "email">;

interface HeaderNavSheetProps {
  navItems: readonly NavItem[];
  /** 현재 href가 활성인지 판별 (pathname.startsWith 또는 pathname === item.href) */
  getIsActive: (item: NavItem) => boolean;
  /** 로그인 시: 드로어 상단에 이름, 하단에 설정·로그아웃 표시 */
  user?: HeaderNavSheetUser;
  settingsPath?: string;
  onSignOut?: () => void | Promise<void>;
}

const DIVIDER_CLASS = "border-b border-border my-2";

/**
 * 모바일(768px 미만)에서 햄버거 메뉴로 네비게이션을 표시하는 Sheet 드로어.
 * user·settingsPath·onSignOut 전달 시 상단에 이름, 하단에 설정·로그아웃 추가.
 */
export default function HeaderNavSheet({
  navItems,
  getIsActive,
  user,
  settingsPath,
  onSignOut,
}: HeaderNavSheetProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const displayName = user?.name || user?.email || "사용자";
  const hasUserSection = user && settingsPath && onSignOut;
  const profilePath = settingsPath ? `${settingsPath}/profile` : "";
  const isSettingsActive =
    !!profilePath &&
    (pathname === profilePath || (!!settingsPath && pathname === `${settingsPath}/password`));

  const closeSheet = () => setOpen(false);

  const handleSignOut = async () => {
    await onSignOut?.();
    closeSheet();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden min-w-11 min-h-11 touch-manipulation"
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col w-[min(85vw,20rem)]">
        <SheetHeader>
          <SheetTitle className="sr-only">메뉴</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col flex-1 min-h-0 pt-4">
          {hasUserSection && (
            <>
              <Link
                href={profilePath}
                onClick={closeSheet}
                className="px-4 py-3 rounded-md text-base font-medium text-foreground truncate touch-manipulation hover:bg-accent hover:text-accent-foreground transition-colors"
                title={displayName}
              >
                {displayName}
              </Link>
              <div className={DIVIDER_CLASS} />
            </>
          )}
          <nav className="flex flex-col gap-1" aria-label="주 메뉴">
            {navItems.map((item) => {
              const isActive = getIsActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSheet}
                  className={cn(
                    "flex items-center gap-3 min-h-11 px-4 rounded-md text-base font-medium transition-colors touch-manipulation",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {hasUserSection && (
            <>
              <div className={DIVIDER_CLASS} />
              <div className="flex flex-col gap-1">
                <Link
                  href={profilePath}
                  onClick={closeSheet}
                  className={cn(
                    "flex items-center gap-3 min-h-11 px-4 rounded-md text-base font-medium transition-colors touch-manipulation",
                    isSettingsActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  설정
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-3 min-h-11 px-4 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors touch-manipulation text-left w-full"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
