import { Skeleton } from "@/components/ui/skeleton";

/**
 * 피드백 페이지 스켈레톤. 헤더 + 자막/피드백 섹션 레이아웃.
 */
export default function FeedbackSkeleton() {
  return (
    <div className="container max-w-4xl py-8">
      <Skeleton className="h-8 w-20 mb-6" />
      <header className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </header>
      <div className="flex flex-col gap-8">
        <section>
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="rounded-lg border p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </section>
        <section>
          <Skeleton className="h-5 w-20 mb-3" />
          <div className="rounded-lg border p-6 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[75%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </section>
      </div>
    </div>
  );
}
