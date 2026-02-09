"use client";

import * as React from "react";
import { ArrowRight, XCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/component/ui/card";
import { cn } from "@/lib/utils";
import type { Correction } from "@/types/feedback";

export interface CorrectionCardProps {
  correction: Correction;
}

/**
 * 교정 항목을 표시하는 카드 컴포넌트.
 * Original Sentence (틀린 표현)과 Better Expression (올바른 표현)을 시각적으로 비교.
 */
export function CorrectionCard({ correction }: CorrectionCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Original vs Better Expression 비교 */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          {/* Original Sentence (틀린 표현) */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">틀린 표현</span>
            </div>
            <p className="text-sm line-through decoration-muted-foreground decoration-2 text-muted-foreground bg-muted/30 rounded px-3 py-2">
              {correction.original_sentence}
            </p>
          </div>

          {/* 화살표 아이콘 */}
          <div className="flex justify-center md:justify-center shrink-0">
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
          </div>

          {/* Better Expression (올바른 표현) */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
              <span className="text-xs font-medium text-foreground">
                올바른 표현
              </span>
            </div>
            <p className="text-sm font-medium text-foreground bg-muted rounded px-3 py-2">
              {correction.better_expression}
            </p>
          </div>
        </div>

        {/* Feedback Detail */}
        {correction.feedback_detail && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  상세 설명
                </p>
                <p className="text-sm text-foreground bg-muted/50 rounded px-3 py-2">
                  {correction.feedback_detail}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
