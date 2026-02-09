"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Link2 } from "lucide-react";
import { Button } from "@/component/ui/button";
import MeetLinkModal from "@/component/teach/MeetLinkModal";
import type { DashboardNextClass } from "@/schema/dashboard/dashboard";
import { cn } from "@/lib/utils";
import { ENTRY_MINUTES_BEFORE } from "@/constants/lesson";

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

function hasMeetLink(schedule: DashboardNextClass): boolean {
  return !!(schedule?.meetLink && schedule.meetLink.trim().length > 0);
}

export default function DashboardNextClassCard({
  schedule,
  role,
  variant = "study",
}: DashboardNextClassCardProps) {
  const router = useRouter();
  const [meetLinkModalOpen, setMeetLinkModalOpen] = useState(false);
  const isTeacher = role === "TEACHER";
  // 강사: meetLink 등록된 경우에만 입장 가능. 학생: 수업 10분 전부터 입장 가능.
  const canEnter = isTeacher
    ? !!(schedule && hasMeetLink(schedule))
    : (schedule ? canStudentEnter(schedule.startsAt) : false);
  const entryMessage = schedule && !isTeacher && !canEnter ? formatEntryAvailable(schedule.startsAt) : null;

  const buttonClass =
    variant === "teach"
      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
      : "bg-primary hover:bg-primary/90 text-primary-foreground";

  if (!schedule) {
    return (
      <div
        className={cn(
          "rounded-xl border p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]",
          variant === "teach"
            ? "border-primary/20 bg-primary/5"
            : "border-secondary bg-secondary/50"
        )}
      >
        <Calendar
          className={cn("size-10", variant === "teach" ? "text-primary" : "text-secondary-foreground")}
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
          ? "border-primary/20 bg-primary/5"
          : "border-secondary bg-secondary/50"
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
        {isTeacher && !hasMeetLink(schedule) && (
          <p className="text-xs text-muted-foreground">
            입장하려면 Meet 링크를 등록해 주세요.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {isTeacher && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setMeetLinkModalOpen(true)}
            >
              <Link2 className="size-4" />
              {hasMeetLink(schedule) ? "Meet 링크 수정" : "Meet 링크 입력"}
            </Button>
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

      {isTeacher && (
        <MeetLinkModal
          open={meetLinkModalOpen}
          onOpenChange={setMeetLinkModalOpen}
          scheduleId={schedule.scheduleId}
          initialMeetLink={schedule.meetLink}
        />
      )}
    </div>
  );
}
