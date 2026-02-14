"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/settings/profile", label: "프로필" },
  { href: "/settings/password", label: "비밀번호" },
] as const;

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b border-border mb-8">
      {NAV_ITEMS.map(({ href, label }) => (
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
      ))}
    </nav>
  );
}
