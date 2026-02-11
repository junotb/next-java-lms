"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/common/Loader";
import FeedbackSkeleton from "@/components/feedback/FeedbackSkeleton";
import { useLessonFeedback } from "@/hooks/useLessonFeedback";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AudioTranscriptPlayer } from "@/components/AudioTranscriptPlayer";
import { FeedbackReport } from "@/components/feedback/FeedbackReport";

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId =
    typeof params.scheduleId === "string"
      ? parseInt(params.scheduleId, 10)
      : null;

  const { data, isLoading, isError, refetch } = useLessonFeedback(scheduleId, {
    enabled: scheduleId != null && !Number.isNaN(scheduleId),
  });

  useEffect(() => {
    if (data?.feedbackStatus === "PROCESSING" || data?.feedbackStatus === "PENDING") {
      const id = setInterval(() => refetch(), 5000);
      return () => clearInterval(id);
    }
  }, [data?.feedbackStatus, refetch]);

  if (scheduleId == null || Number.isNaN(scheduleId)) {
    return (
      <div className="container max-w-4xl py-12">
        <p className="text-muted-foreground">잘못된 수업 번호입니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return <FeedbackSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="container max-w-4xl py-12">
        <p className="text-foreground">피드백 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const isProcessing =
    data.feedbackStatus === "PROCESSING" || data.feedbackStatus === "PENDING";
  const isFailed = data.feedbackStatus === "FAILED";

  return (
    <div className="container max-w-4xl py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 gap-1"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        뒤로
      </Button>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          수업 피드백
          {data.courseTitle && (
            <span className="ml-2 text-lg font-normal text-muted-foreground">
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
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
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
              <AudioTranscriptPlayer
                vttContent={data.vttContent}
                title=""
              />
            </section>
          )}

          {data.feedbackContent && (
            <section>
              <h2 className="text-lg font-semibold mb-3">AI 피드백</h2>
              <FeedbackReport feedbackContent={data.feedbackContent} />
            </section>
          )}

          {!data.vttContent && !data.feedbackContent && data.feedbackStatus === "COMPLETED" && (
            <p className="text-muted-foreground">표시할 내용이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
