import { Skeleton } from "@/components/ui/skeleton";

/**
 * 수업방 페이지 스켈레톤. 비디오 영역 + 하단 컨트롤러 레이아웃.
 */
export default function ClassroomSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-950">
      <div className="flex-1 flex min-h-0 p-2">
        <div className="flex-1 rounded-lg overflow-hidden bg-zinc-900 flex items-center justify-center">
          <Skeleton className="aspect-video w-full max-w-2xl bg-zinc-800" />
        </div>
      </div>
      <div className="h-14 px-4 bg-zinc-900/95 border-t border-zinc-800 flex items-center justify-between shrink-0">
        <Skeleton className="h-6 w-32 bg-zinc-800" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 bg-zinc-800" />
          <Skeleton className="h-9 w-20 bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
