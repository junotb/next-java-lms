"use client";

import { useParams, useRouter } from "next/navigation";
import ClassroomSkeleton from "@/components/classroom/ClassroomSkeleton";
import MeetLinkArea from "@/components/classroom/MeetLinkArea";
import LessonController from "@/components/classroom/LessonController";
import { useLessonAccess } from "@/hooks/useLesson";

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : null;

  const { data, isLoading, isError } = useLessonAccess(id, { enabled: id != null && !Number.isNaN(id) });

  if (id == null || Number.isNaN(id)) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        잘못된 수업 번호입니다.
      </div>
    );
  }

  if (isLoading) {
    return <ClassroomSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        수업 정보를 불러올 수 없습니다.
      </div>
    );
  }

  if (!data.allowed) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex min-h-0 p-2">
        <MeetLinkArea meetLink={data.meetLink} />
      </div>
      <LessonController
        scheduleId={id}
        role={data.role}
        startsAt={data.schedule.startsAt}
        endsAt={data.schedule.endsAt}
        onExit={() => router.back()}
      />
    </div>
  );
}
