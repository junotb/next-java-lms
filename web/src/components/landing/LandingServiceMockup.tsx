import {
  Video,
  LogOut,
  XCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

/**
 * 랜딩 페이지용 서비스 화면 예시.
 * 2개의 별도 페이지를 소개: study/classroom (수업실), study/feedback (AI 피드백).
 */
export default function LandingServiceMockup() {
  return (
    <div className="relative lg:ml-auto">
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {/* 수업실 div */}
        <div className="flex flex-1 flex-col gap-2">
          <span className="mb-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground">
            1. 수업실
          </span>
          <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-2xl border border-border/50 bg-background p-3 shadow-xl shadow-foreground/5">
          <div className="rounded-lg bg-zinc-900/50 px-3 py-2 shrink-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">
              실무 영어 회화
            </p>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-zinc-950 p-4">
            <div className="rounded-full bg-zinc-800/80 p-6">
              <Video className="size-10 text-zinc-600" strokeWidth={1.5} />
            </div>
            <p className="text-center text-[11px] font-medium text-zinc-400">
              아래 버튼을 클릭하여 Google Meet에 참가하세요.
            </p>
            <div className="h-8 w-24 rounded-md bg-foreground/90" />
          </div>
          {/* 수업실 전용: LessonController (남은 시간, 나가기) */}
          <div className="flex shrink-0 items-center justify-between gap-2 rounded-xl border-t border-zinc-800 bg-zinc-900/95 px-3 py-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[10px]">남은 시간</span>
              <span className="font-mono text-xs tabular-nums text-white">
                00:45:22
              </span>
            </div>
            <div className="flex gap-1">
              <div className="flex h-6 w-12 items-center justify-center gap-0.5 rounded border border-zinc-600">
                <LogOut className="h-2.5 w-2.5 text-zinc-400" />
                <span className="text-[9px] text-zinc-300">나가기</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* 화살표 UI - 모바일: 아래, 데스크톱: 오른쪽 */}
        <div className="flex shrink-0 items-center justify-center text-muted-foreground/60">
          <ChevronDown className="size-8 sm:hidden" />
          <ChevronRight className="hidden size-10 sm:block" />
        </div>

        {/* 피드백 div */}
        <div className="flex flex-1 flex-col gap-2">
          <span className="mb-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground">
            2. AI 피드백
          </span>
          <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-2xl border border-border/50 bg-background p-3 shadow-xl shadow-foreground/5">
          <Alert className="shrink-0 border-muted bg-muted/50 p-2">
            <AlertDescription className="text-[10px] text-foreground">
              전체적으로 좋은 진행이었습니다.
            </AlertDescription>
          </Alert>
          <Card className="shrink-0 overflow-hidden">
            <CardContent className="p-3">
              <div className="flex flex-col gap-2">
                <div>
                  <div className="mb-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[9px] font-medium text-muted-foreground">
                      틀린 표현
                    </span>
                  </div>
                  <p className="rounded bg-muted/30 px-2 py-1 text-[10px] text-muted-foreground line-through decoration-muted-foreground">
                    I have a plan to go there...
                  </p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-3 w-3 rotate-90 text-muted-foreground" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-foreground" />
                    <span className="text-[9px] font-medium text-foreground">
                      올바른 표현
                    </span>
                  </div>
                  <p className="rounded bg-muted px-2 py-1 text-[10px] font-medium text-foreground">
                    I intend to visit...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      {/* 배경 블러 장식 */}
      <div className="absolute -top-16 -right-16 -z-10 h-64 w-64 rounded-full bg-muted blur-3xl opacity-50" />
      <div className="absolute -bottom-16 -left-16 -z-10 h-64 w-64 rounded-full bg-muted blur-3xl opacity-50" />
    </div>
  );
}
