"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/component/ui/badge";
import { Button } from "@/component/ui/button";
import VideoUploadModal from "@/component/teach/VideoUploadModal";
import { getScheduleStatusName } from "@/lib/schedule";
import type { DashboardScheduleItem } from "@/schema/dashboard/dashboard";
import type { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { cn } from "@/lib/utils";
import { ENTRY_MINUTES_BEFORE } from "@/constants/lesson";

type Role = "STUDENT" | "TEACHER";

interface DashboardScheduleListProps {
  title: string;
  schedules: DashboardScheduleItem[];
  role: Role;
  emptyMessage?: string;
  className?: string;
  /** Student: blue. Teacher: violet */
  variant?: "study" | "teach";
}

const statusVariant: Record<ScheduleStatus, "default" | "secondary" | "destructive" | "outline"> = {
  SCHEDULED: "secondary",
  ATTENDED: "default",
  ABSENT: "destructive",
  CANCELLED: "outline",
};

function formatDatetime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function canStudentEnter(startsAt: string, endsAt: string): boolean {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const allowedFrom = start - ENTRY_MINUTES_BEFORE * 60 * 1000;
  const now = Date.now();
  return now >= allowedFrom && now <= end;
}

function getEntryTooltip(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt).getTime();
  const allowedFrom = start - ENTRY_MINUTES_BEFORE * 60 * 1000;
  const now = Date.now();
  
  if (now < allowedFrom) {
    const d = new Date(allowedFrom);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} 입장 가능`;
  }
  if (now > new Date(endsAt).getTime()) {
    return "수업이 종료되었습니다";
  }
  return "";
}

export default function DashboardScheduleList({
  title,
  schedules,
  role,
  emptyMessage = "내역이 없습니다.",
  className,
  variant = role === "TEACHER" ? "teach" : "study",
}: DashboardScheduleListProps) {
  const router = useRouter();
  const [videoUploadScheduleId, setVideoUploadScheduleId] = useState<number | null>(null);
  const isTeacher = role === "TEACHER";

  const handleEnter = (scheduleId: number) => {
    router.push(`/classroom/${scheduleId}`);
  };

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="rounded-lg border bg-card overflow-hidden">
        {schedules.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium p-3 w-20">상태</th>
                  <th className="text-left font-medium p-3">수업명</th>
                  <th className="text-left font-medium p-3">일시</th>
                  <th className="text-left font-medium p-3">{isTeacher ? "학생" : "강사"}</th>
                  <th className="text-right font-medium p-3 w-24">관리</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((row) => {
                  const isScheduled = row.status === "SCHEDULED";
                  const canEnter = isTeacher
                    ? isScheduled
                    : isScheduled && canStudentEnter(row.startsAt, row.endsAt);
                  const tooltip = !isTeacher && isScheduled && !canEnter
                    ? getEntryTooltip(row.startsAt, row.endsAt)
                    : "";
                  const otherName = isTeacher ? row.studentName : row.instructorName;
                  const buttonClass = variant === "teach"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground";

                  return (
                    <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <Badge variant={statusVariant[row.status as ScheduleStatus] ?? "outline"}>
                          {getScheduleStatusName(row.status as ScheduleStatus)}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">
                        {row.courseTitle ?? `수업 #${row.id}`}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatDatetime(row.startsAt)}
                      </td>
                      <td className="p-3 text-muted-foreground text-sm">
                        {otherName ?? "-"}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          {isScheduled ? (
                            <Button
                              size="sm"
                              className={cn("text-xs", buttonClass)}
                              onClick={() => handleEnter(row.id)}
                              disabled={!canEnter}
                              title={tooltip || undefined}
                            >
                              입장
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => router.push(`/feedback/${row.id}`)}
                              >
                                피드백
                              </Button>
                              {isTeacher && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => setVideoUploadScheduleId(row.id)}
                                >
                                  영상
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isTeacher && videoUploadScheduleId != null && (
        <VideoUploadModal
          open={true}
          onOpenChange={(open) => !open && setVideoUploadScheduleId(null)}
          scheduleId={videoUploadScheduleId}
        />
      )}
    </section>
  );
}
