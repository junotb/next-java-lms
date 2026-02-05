"use client";

import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { Button } from "@/component/ui/button";
import type { DashboardNextClass } from "@/schema/dashboard/dashboard";
import { cn } from "@/lib/utils";

const ENTRY_MINUTES_BEFORE = 10;

type Role = "STUDENT" | "TEACHER";

interface DashboardNextClassCardProps {
  schedule: DashboardNextClass | null;
  role: Role;
  /** Student: blue. Teacher: violet */
  variant?: "study" | "teach";
}

function formatEntryAvailable(startsAt: string): string {
  const d = new Date(startsAt);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  return `${month}월 ${day}일 ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} 입장 가능`;
}

function canStudentEnter(startsAt: string): boolean {
  const start = new Date(startsAt).getTime();
  const allowedFrom = start - ENTRY_MINUTES_BEFORE * 60 * 1000;
  return Date.now() >= allowedFrom;
}

export default function DashboardNextClassCard({
  schedule,
  role,
  variant = "study",
}: DashboardNextClassCardProps) {
  const router = useRouter();
  const isTeacher = role === "TEACHER";
  // 강사는 예정된 수업(SCHEDULED)이면 시간 무관하게 항상 입장 가능
  const canEnter = isTeacher ? true : (schedule ? canStudentEnter(schedule.startsAt) : false);
  const entryMessage = schedule && !isTeacher && !canEnter ? formatEntryAvailable(schedule.startsAt) : null;

  const buttonClass =
    variant === "teach"
      ? "bg-violet-600 hover:bg-violet-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  if (!schedule) {
    return (
      <div
        className={cn(
          "rounded-xl border p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]",
          variant === "teach"
            ? "border-violet-200 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/30"
            : "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30"
        )}
      >
        <Calendar
          className={cn("size-10", variant === "teach" ? "text-violet-500" : "text-blue-500")}
          strokeWidth={1.5}
        />
        <p className="text-sm font-medium text-muted-foreground">예정된 수업이 없습니다</p>
      </div>
    );
  }

  const otherName = isTeacher ? schedule.studentName : schedule.instructorName;
  const dateStr = new Date(schedule.startsAt).toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "rounded-xl border p-6 flex flex-col gap-4",
        variant === "teach"
          ? "border-violet-200 bg-violet-50 dark:border-violet-900/50 dark:bg-violet-950/30"
          : "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{schedule.courseTitle}</h2>
          {otherName && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {isTeacher ? "학생" : "강사"}: {otherName}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">{dateStr}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {entryMessage && (
          <p className="text-xs text-muted-foreground">{entryMessage}</p>
        )}
        <Button
          className={cn("w-fit", buttonClass)}
          onClick={() => router.push(`/classroom/${schedule.scheduleId}`)}
          disabled={!canEnter}
        >
          수업 입장
        </Button>
      </div>
    </div>
  );
}
