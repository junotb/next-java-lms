"use client";

import type { LessonAccessResponse } from "@/schema/lesson/lesson";

interface CourseViewerProps {
  data: LessonAccessResponse;
}

export default function CourseViewer({ data }: CourseViewerProps) {
  const title = data.course?.title ?? "수업";
  const description = data.course?.description ?? data.schedule ? `수업 시간: ${formatRange(data.schedule.startsAt, data.schedule.endsAt)}` : "";

  return (
    <aside className="w-80 shrink-0 flex flex-col bg-zinc-900/95 border-l border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          수업 정보
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-base font-medium text-white mb-1">{title}</h3>
          {description ? (
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">{description}</p>
          ) : null}
        </div>
        {data.schedule ? (
          <div className="text-xs text-zinc-500">
            <p>시작: {formatDatetime(data.schedule.startsAt)}</p>
            <p>종료: {formatDatetime(data.schedule.endsAt)}</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function formatRange(startsAt: string, endsAt: string): string {
  const s = new Date(startsAt);
  const e = new Date(endsAt);
  return `${formatDatetime(startsAt)} ~ ${formatDatetime(endsAt)}`;
}

function formatDatetime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
