"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface NavItem {
  href: string;
  label: string;
}

interface HeaderNavSheetProps {
  navItems: NavItem[];
  /** 현재 href가 활성인지 판별 (pathname.startsWith 또는 pathname === item.href) */
  getIsActive: (item: NavItem) => boolean;
}

/**
 * 모바일(768px 미만)에서 햄버거 메뉴로 네비게이션을 표시하는 Sheet 드로어.
 * md 이상에서는 사용하지 않고 데스크톱 nav만 표시.
 */
export default function HeaderNavSheet({
  navItems,
  getIsActive,
}: HeaderNavSheetProps) {
  const [open, setOpen] = useState(false);

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
      <SheetContent side="right" className="w-[min(85vw,20rem)]">
        <SheetHeader>
          <SheetTitle className="sr-only">메뉴</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 pt-4" aria-label="주 메뉴">
          {navItems.map((item) => {
            const isActive = getIsActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center min-h-11 px-4 rounded-md text-base font-medium transition-colors touch-manipulation",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
