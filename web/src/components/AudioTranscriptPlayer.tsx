"use client";

import * as React from "react";
import { parseVtt } from "@/lib/parseVtt";
import type { VttCue } from "@/types/vtt";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface AudioTranscriptPlayerProps {
  /** VTT 형식 자막 문자열 */
  vttContent: string;
  /** 카드 제목 (선택) */
  title?: string;
}

/**
 * VTT 자막을 Chat-style UI로 표시하는 컴포넌트.
 * Speaker 1은 왼쪽(회색), Speaker 2는 오른쪽(Primary)으로 구분하여 표시.
 */
export function AudioTranscriptPlayer({
  vttContent,
  title = "Transcript",
}: AudioTranscriptPlayerProps) {
  const cues = React.useMemo(() => parseVtt(vttContent), [vttContent]);

  const isSpeaker2 = (cue: VttCue) =>
    cue.name.toLowerCase().includes("speaker 2") ||
    cue.name === "Speaker 2";

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        {/* 자막 영역 (Chat-style) */}
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-3 pr-4">
            {cues.map((cue, index) => {
              const isMe = isSpeaker2(cue);

              return (
                <div
                  key={`${cue.start}-${index}`}
                  className={cn(
                    "flex",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      isMe
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <span className="text-xs opacity-80">{cue.name}</span>
                    <p className="mt-0.5">{cue.text}</p>
                  </div>
                </div>
              );
            })}
            {cues.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">
                자막이 없습니다.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
