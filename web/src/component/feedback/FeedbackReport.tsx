"use client";

import * as React from "react";
import { Alert, AlertDescription } from "@/component/ui/alert";
import { CorrectionCard } from "./CorrectionCard";
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
  const feedbackData = React.useMemo<FeedbackData | null>(() => {
    // null이나 undefined 체크
    if (!feedbackContent) {
      return null;
    }

    // 이미 객체인 경우
    if (typeof feedbackContent === "object" && !Array.isArray(feedbackContent)) {
      return feedbackContent as FeedbackData;
    }

    // 문자열인 경우 파싱 시도
    if (typeof feedbackContent === "string") {
      let trimmed = feedbackContent.trim();
      if (!trimmed) {
        return null;
      }

      // 마크다운 코드 블록 제거 (```json ... ```)
      trimmed = trimmed.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

      // 이스케이프된 JSON 문자열 처리 (예: "\"{\\\"feedback_summary\\\":...}\"")
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        try {
          trimmed = JSON.parse(trimmed) as string;
        } catch {
          // 이스케이프가 아니면 그대로 진행
        }
      }

      try {
        const parsed = JSON.parse(trimmed) as FeedbackData;
        // 파싱된 객체가 올바른 구조인지 검증
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.feedback_summary &&
          Array.isArray(parsed.corrections)
        ) {
          return parsed;
        }
        console.warn("Parsed data does not match expected structure:", parsed);
        return null;
      } catch (e) {
        console.error("Failed to parse feedback content:", e);
        console.error("Content type:", typeof trimmed);
        console.error("Content length:", trimmed.length);
        console.error("Content preview:", trimmed.substring(0, 200));
        return null;
      }
    }

    return null;
  }, [feedbackContent]);

  if (!feedbackData) {
    return (
      <div className="rounded-lg border border-muted-foreground/30 bg-muted/30 p-6">
        <p className="text-foreground text-sm font-medium mb-2">
          피드백 데이터를 파싱할 수 없습니다.
        </p>
        <p className="text-xs text-muted-foreground">
          데이터 형식을 확인해주세요. (타입: {typeof feedbackContent})
        </p>
        {typeof feedbackContent === "string" && (
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
            {feedbackContent.substring(0, 500)}
          </pre>
        )}
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
