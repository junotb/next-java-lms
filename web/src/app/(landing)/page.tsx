"use client";

import AuthModalContainer from "@/component/auth/AuthModalContainer";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { openModal } = useAuthModalStore();

  return (
    <div>
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-blue-50),white)]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-x-2 rounded-full bg-blue-600/10 px-4 py-1 text-sm font-semibold leading-6 text-blue-700 ring-1 ring-inset ring-blue-600/10">
                <span className="font-bold">Next-Gen Language Service</span>
                <span className="h-4 w-px bg-blue-600/20" />
                <span>NexLang</span>
              </div>

              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
                사람이 가르치고,
                <br />
                <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  AI가 증명합니다.
                </span>
              </h1>

              <p className="mt-8 text-lg font-medium text-pretty text-slate-600 sm:text-xl/8">
                휘발되는 수업은 이제 그만. 1:1 대면 수업의 몰입감과 LLM이 분석한
                데이터 기반 피드백으로 당신의 언어를 완성하세요.
              </p>

              <div className="mt-12 flex flex-col items-center gap-y-4 sm:flex-row sm:gap-x-6 lg:justify-start">
                <Button
                  onClick={() => openModal("signin")}
                  aria-label="로그인 페이지로 이동"
                  className={cn(
                    "rounded-2xl px-8 py-4 text-lg font-bold shadow-xl shadow-blue-500/20 transition-transform hover:-translate-y-1",
                    "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  무료 수업 시작하기
                </Button>
              </div>
              <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-slate-100 pt-8 sm:grid-cols-3">
                {[
                  ["WebRTC 1:1", "초저지연 대면 수업"],
                  ["STT Analysis", "모든 대화의 기록"],
                  ["LLM Feedback", "AI 정밀 교정 보고서"],
                ].map(([title, desc]) => (
                  <div key={title} className="flex flex-col gap-y-1">
                    <dt className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      {title}
                    </dt>
                    <dd className="text-sm text-slate-500">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative lg:ml-auto">
              <div className="relative z-10 w-full rounded-3xl bg-slate-900 p-2 shadow-2xl ring-1 ring-white/10 lg:w-[540px]">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center border-b border-white/5">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-500/20 p-2 ring-1 ring-blue-500/50 animate-pulse" />
                      <p className="text-xs font-medium text-slate-400">
                        강사님과 교육 콘텐츠 공유 중...
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-4 bottom-4 h-24 w-32 rounded-lg bg-slate-700 ring-1 ring-white/20 shadow-lg" />
                </div>

                <div className="mt-4 rounded-xl bg-white p-5 shadow-inner">
                  <div className="flex items-center gap-2 mb-3 text-blue-600">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-tighter italic">
                      AI Analysis Report
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800 italic">
                      &quot;I have a plan to go there...&quot;
                    </p>
                    <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded-md border-l-2 border-blue-400">
                      비즈니스 상황에서는{" "}
                      <strong>&quot;I intend to visit...&quot;</strong> 가 더
                      전문적인 뉘앙스를 줍니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-16 -right-16 -z-10 h-64 w-64 rounded-full bg-indigo-100 blur-3xl opacity-50" />
              <div className="absolute -bottom-16 -left-16 -z-10 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-50" />
            </div>
          </div>
        </div>
      </section>

      <AuthModalContainer />
    </div>
  );
}
