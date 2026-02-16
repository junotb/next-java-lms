"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SettingsNavProps {
  /** 설정 경로 prefix (예: /admin/settings) */
  basePath: string;
}

const NAV_ITEMS = [
  { path: "/profile", label: "프로필" },
  { path: "/password", label: "비밀번호" },
] as const;

/**
 * 설정 하위 네비게이션. basePath 하위로 profile, password 링크 생성.
 */
export default function SettingsNav({ basePath }: SettingsNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b border-border mb-8">
      {NAV_ITEMS.map(({ path, label }) => {
        const href = `${basePath}${path}`;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "pb-3 px-1 text-sm font-medium border-b-2 border-transparent hover:text-foreground transition-colors",
              pathname === href
                ? "border-primary text-foreground"
                : "text-muted-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
