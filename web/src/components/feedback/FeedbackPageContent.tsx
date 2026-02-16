"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import Loader from "@/components/common/Loader";
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";
import { useScheduleFeedback } from "@/hooks/useScheduleFeedback";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { AudioTranscriptPlayer } from "@/components/feedback/AudioTranscriptPlayer";
import { FeedbackReport } from "@/components/feedback/FeedbackReport";

export interface FeedbackPageContentProps {
  /** 역할별 대시보드 경로 (예: /study, /teach) */
  dashboardPath: "/study" | "/teach";
}

/**
 * 수업 피드백 페이지 공통 컨텐츠.
 * study/feedback, teach/feedback에서 공유.
 */
export function FeedbackPageContent({ dashboardPath }: FeedbackPageContentProps) {
  const params = useParams();
  const router = useRouter();
  const scheduleId =
    typeof params.scheduleId === "string"
      ? parseInt(params.scheduleId, 10)
      : null;

  const { data, isLoading, isError, refetch } = useScheduleFeedback(scheduleId, {
    enabled: scheduleId != null && !Number.isNaN(scheduleId),
  });

  useEffect(() => {
    if (
      data?.feedbackStatus === "PROCESSING" ||
      data?.feedbackStatus === "PENDING"
    ) {
      const id = setInterval(() => refetch(), 5000);
      return () => clearInterval(id);
    }
  }, [data?.feedbackStatus, refetch]);

  if (scheduleId == null || Number.isNaN(scheduleId)) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-muted-foreground mb-4">잘못된 수업 번호입니다.</p>
        <Button variant="outline" asChild>
          <Link href={dashboardPath}>대시보드로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <FeedbackSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-foreground mb-4">
          피드백 정보를 불러올 수 없습니다.
        </p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RotateCcw className="size-4" />
          다시 시도
        </Button>
      </div>
    );
  }

  const isProcessing =
    data.feedbackStatus === "PROCESSING" || data.feedbackStatus === "PENDING";
  const isFailed = data.feedbackStatus === "FAILED";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 z-50 size-11 rounded-full shadow-lg touch-manipulation"
        onClick={() => router.back()}
        aria-label="뒤로"
      >
        <ArrowLeft className="size-5" />
      </Button>

      <header className="mb-8 min-w-0">
        <h1 className="text-2xl font-bold text-foreground flex items-baseline gap-x-2 min-w-0">
          <span className="shrink-0">수업 피드백</span>
          {data.courseTitle && (
            <span className="text-lg font-normal text-muted-foreground truncate min-w-0" title={data.courseTitle}>
              — {data.courseTitle}
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date(data.startsAt).toLocaleString("ko-KR")} ~{" "}
          {new Date(data.endsAt).toLocaleString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </header>

      {isProcessing && (
        <div
          className="rounded-lg border bg-muted/50 p-8 text-center"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader />
          <p className="mt-4 text-sm text-muted-foreground">
            피드백을 생성하고 있습니다. 잠시만 기다려 주세요.
          </p>
        </div>
      )}

      {isFailed && (
        <div className="rounded-lg border border-muted-foreground/30 bg-muted/30 p-6">
          <p className="text-foreground font-medium">
            피드백 생성에 실패했습니다.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            영상을 다시 업로드해 주세요.
          </p>
        </div>
      )}

      {!isProcessing && !isFailed && (
        <div className="flex flex-col gap-8">
          {data.vttContent && (
            <section>
              <h2 className="text-lg font-semibold mb-3">수업 자막</h2>
              <AudioTranscriptPlayer vttContent={data.vttContent} title="" />
            </section>
          )}

          {data.feedbackContent && (
            <section>
              <h2 className="text-lg font-semibold mb-3">AI 피드백</h2>
              <FeedbackReport feedbackContent={data.feedbackContent} />
            </section>
          )}

          {!data.vttContent &&
            !data.feedbackContent &&
            data.feedbackStatus === "COMPLETED" && (
              <div className="rounded-lg border bg-muted/30 p-6">
                <p className="text-muted-foreground mb-4">
                  표시할 내용이 없습니다.
                </p>
                <Button variant="outline" asChild>
                  <Link href={dashboardPath}>대시보드로 돌아가기</Link>
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
