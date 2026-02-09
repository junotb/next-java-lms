"use client";

import { cn } from "@/lib/utils";

interface DashboardSkeletonProps {
  variant?: "study" | "teach";
  className?: string;
}

export default function DashboardSkeleton({ variant = "study", className }: DashboardSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-6 animate-pulse", className)}>
      {/* Next class card skeleton */}
      <div
        className={cn(
          "rounded-xl border p-6 min-h-[180px]",
          variant === "teach"
            ? "border-primary/20 bg-primary/5"
            : "border-secondary bg-secondary/50"
        )}
      >
        <div className="h-5 w-48 rounded bg-muted mb-3" />
        <div className="h-4 w-32 rounded bg-muted mb-4" />
        <div className="h-10 w-24 rounded bg-muted" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="h-3 w-16 rounded bg-muted mb-2" />
              <div className="h-6 w-12 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div>
        <div className="h-5 w-32 rounded bg-muted mb-3" />
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="h-12 border-b bg-muted/50" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 border-b last:border-0 flex items-center gap-4 px-3">
              <div className="h-5 w-14 rounded bg-muted" />
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-4 w-36 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
