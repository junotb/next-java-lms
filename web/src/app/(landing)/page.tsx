"use client";

import AuthModalContainer from "@/components/auth/AuthModalContainer";
import LandingServiceMockup from "@/components/landing/LandingServiceMockup";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LANDING_FEATURES } from "@/constants/landing";

/**
 * 랜딩 페이지.
 * 서비스 소개, CTA, 인증 모달.
 */
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
                수업이 끝나도 사라지지 않습니다.
                <br className="hidden sm:block" />
                Google Meet 1:1 화상 수업 후, 녹화본 업로드 시 자동 자막과 LLM
                교정 피드백으로 당신의 언어를 완성하세요.
              </p>

              <div className="mt-12 flex flex-col items-center gap-y-4 sm:flex-row sm:gap-x-6 lg:justify-start">
                <Button
                  onClick={() => openModal("signup")}
                  aria-label="무료 회원가입으로 시작하기"
                  className={cn(
                    "rounded-2xl px-8 py-4 text-lg font-bold shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1"
                  )}
                >
                  무료 수업 시작하기
                </Button>
              </div>
              <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-3">
                {LANDING_FEATURES.map(([title, desc]) => (
                  <div key={title} className="flex flex-col gap-y-1">
                    <dt className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {title}
                    </dt>
                    <dd className="text-sm text-muted-foreground">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <LandingServiceMockup />
          </div>
        </div>
      </section>

      <AuthModalContainer />
    </div>
  );
}
