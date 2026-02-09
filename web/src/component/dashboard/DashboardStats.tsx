"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardStatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

interface DashboardStatsProps {
  items: DashboardStatItem[];
  /** "study" = blue accent, "teach" = violet accent */
  variant?: "study" | "teach";
  className?: string;
}

export default function DashboardStats({
  items,
  variant = "study",
  className,
}: DashboardStatsProps) {
  const iconBg = variant === "teach" 
    ? "bg-primary/10 text-primary" 
    : "bg-secondary text-secondary-foreground";

  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4"
        >
          <div className={cn("rounded-lg p-2.5", iconBg)}>
            <item.icon className="size-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">
              {item.label}
            </p>
            <p className="text-xl font-semibold tabular-nums">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
