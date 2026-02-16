"use client";

import { useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CorrectionCard } from "./CorrectionCard";
import { parseFeedbackContent } from "@/lib/feedback";
import type { FeedbackData } from "@/types/feedback";

export interface FeedbackReportProps {
  /** JSON 문자열 또는 파싱된 FeedbackData 객체 */
  feedbackContent: string | FeedbackData;
}

/**
 * 피드백 리포트 컴포넌트.
 * opening_message, corrections, closing_message를 구조화하여 표시.
 */
export function FeedbackReport({ feedbackContent }: FeedbackReportProps) {
  const feedbackData = useMemo(
    () => parseFeedbackContent(feedbackContent),
    [feedbackContent]
  );

  if (!feedbackData) {
    return (
      <div className="rounded-lg border border-muted-foreground/30 bg-muted/30 p-6">
        <p className="text-foreground text-sm font-medium">
          피드백 형식을 읽을 수 없습니다.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const { feedback_summary, corrections } = feedbackData;

  return (
    <div className="flex flex-col gap-6">
      {/* Opening Message */}
      {feedback_summary.opening_message && (
        <Alert className="bg-muted/50 border-muted">
          <AlertDescription className="text-foreground">
            {feedback_summary.opening_message}
          </AlertDescription>
        </Alert>
      )}

      {/* Corrections List */}
      {corrections && corrections.length > 0 && (
        <div className="space-y-4">
          {corrections.map((correction) => (
            <CorrectionCard key={correction.id} correction={correction} />
          ))}
        </div>
      )}

      {/* Closing Message */}
      {feedback_summary.closing_message && (
        <Alert className="bg-muted/50 border-muted">
          <AlertDescription className="text-foreground">
            {feedback_summary.closing_message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
