"use client";

import AuthModalContainer from "@/components/auth/AuthModalContainer";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { openModal } = useAuthModalStore();

  return (
    <div>
      <section className="relative overflow-hidden bg-background py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-muted),var(--color-background))]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-x-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                <span className="font-bold">Next-Gen Language Service</span>
                <span className="h-4 w-px bg-primary/20" />
                <span>NexLang</span>
              </div>

              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
                사람이 가르치고,
                <br />
                <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  AI가 증명합니다.
                </span>
              </h1>

              <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                휘발되는 수업은 이제 그만. 1:1 대면 수업의 몰입감과 LLM이 분석한
                데이터 기반 피드백으로 당신의 언어를 완성하세요.
              </p>

              <div className="mt-12 flex flex-col items-center gap-y-4 sm:flex-row sm:gap-x-6 lg:justify-start">
                <Button
                  onClick={() => openModal("signin")}
                  aria-label="로그인 페이지로 이동"
                  className={cn(
                    "rounded-2xl px-8 py-4 text-lg font-bold shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1"
                  )}
                >
                  무료 수업 시작하기
                </Button>
              </div>
              <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-3">
                {[
                  ["WebRTC 1:1", "초저지연 대면 수업"],
                  ["STT Analysis", "모든 대화의 기록"],
                  ["LLM Feedback", "AI 정밀 교정 보고서"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex flex-col gap-y-1">
                    <dt className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {title}
                    </dt>
                    <dd className="text-sm text-muted-foreground">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative lg:ml-auto">
              <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl shadow-foreground/5 lg:w-[520px]">
                <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                  </div>
                  <span className="ml-2 truncate text-[11px] text-muted-foreground">
                    classroom.nexlang.io
                  </span>
                </div>

                <div className="grid gap-3 p-3 sm:grid-cols-[1fr_200px]">
                  <div className="relative overflow-hidden rounded-lg bg-zinc-950 aspect-[4/3] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,var(--color-primary)/8,transparent)]" />
                    <div className="relative text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800/90 ring-1 ring-zinc-700/50">
                        <div className="h-6 w-6 rounded bg-primary/30" />
                      </div>
                      <p className="text-xs font-medium text-zinc-500">
                        Google Meet 연결됨
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        1:1 대면 수업 진행 중
                      </p>
                    </div>
                    <div className="absolute right-2 bottom-2 h-16 w-20 overflow-hidden rounded-md bg-zinc-800/95 ring-1 ring-zinc-700/60">
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[10px] text-zinc-600">강사</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
                    <div className="mb-2.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        AI 교정 피드백
                      </span>
                    </div>
                    <p className="text-xs italic text-foreground/90">
                      &quot;I have a plan to go there...&quot;
                    </p>
                    <div className="mt-2 rounded border-l-2 border-primary bg-muted/50 px-2 py-1.5">
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        비즈니스 상황에서는{" "}
                        <strong className="font-semibold text-foreground">
                          &quot;I intend to visit...&quot;
                        </strong>{" "}
                        가 더 전문적입니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 bg-zinc-900/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">남은 시간</span>
                    <span className="font-mono text-sm font-medium tabular-nums text-zinc-300">
                      00:45:22
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-16 rounded-md bg-zinc-700/60" />
                    <div className="h-7 w-14 rounded-md border border-zinc-600/80 bg-zinc-800/60" />
                  </div>
                </div>
              </div>

              <div className="absolute -top-16 -right-16 -z-10 h-64 w-64 rounded-full bg-muted blur-3xl opacity-50" />
              <div className="absolute -bottom-16 -left-16 -z-10 h-64 w-64 rounded-full bg-muted blur-3xl opacity-50" />
            </div>
          </div>
        </div>
      </section>

      <AuthModalContainer />
    </div>
  );
}
