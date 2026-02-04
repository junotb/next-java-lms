"use client";

import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { Badge } from "@/component/ui/badge";
import {
  useFindCandidates,
} from "@/hook/study/useRegistration";
import type { ApiError } from "@/lib/api";
import { registerCourse } from "@/lib/registration-api";
import {
  CourseRegistrationSchema,
  DAYS_OF_WEEK,
  type CourseRegistrationRequest,
  type DayOfWeek,
} from "@/schema/registration";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { useToastStore } from "@/store/useToastStore";

const MONTH_OPTIONS = [1, 3, 6, 12] as const;
const DURATION_OPTIONS = [30, 45, 60, 90] as const;
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

export default function StudyRegistrationPage() {
  const { step, formData, setStep, updateFormData, reset } =
    useRegistrationStore();
  const { showToast } = useToastStore();

  const candidateParams = useMemo(() => {
    const { days, startTime, durationMinutes } = formData;
    if (
      !days?.length ||
      !startTime ||
      !durationMinutes ||
      durationMinutes <= 0
    )
      return null;
    return { days, startTime, durationMinutes };
  }, [formData]);

  const { data: candidates, isLoading: candidatesLoading } = useFindCandidates(
    candidateParams,
    step === 3
  );

  const mutation = useMutation({
    mutationFn: (payload: CourseRegistrationRequest & { courseId?: number }) => registerCourse(payload),
    onSuccess: () => {
      showToast("수강 신청이 완료되었습니다.", "success");
      reset();
    },
    onError: (err: ApiError) => {
      if (err.status === 429) {
        showToast(
          "현재 대기자가 많습니다. 잠시 후 재시도합니다.",
          "error"
        );
      } else {
        showToast(err.message || "수강 신청에 실패했습니다.", "error");
      }
    },
  });

  const handleNext = useCallback(() => {
    if (step < 4) setStep(step + 1);
  }, [step, setStep]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step, setStep]);

  const handleSubmit = useCallback(() => {
    const parsed = CourseRegistrationSchema.safeParse(formData);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
      showToast(msg, "error");
      return;
    }
    // 백엔드 API 호출 시 courseId를 고정값 3로 설정
    mutation.mutate({
      ...parsed.data,
      courseId: 3,
    });
  }, [formData, mutation, showToast]);

  const canProceedStep1 = typeof formData.months === "number";
  const canProceedStep2 =
    Array.isArray(formData.days) && formData.days.length >= 1;
  const canProceedStep3 =
    !!formData.startTime &&
    typeof formData.durationMinutes === "number" &&
    formData.durationMinutes > 0;


  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">
            수강 신청 마법사
          </CardTitle>
          <CardDescription className="mt-1 text-sm">
            Step {step} / 4 —{" "}
            {step === 1 && "기간 선택"}
            {step === 2 && "요일 선택"}
            {step === 3 && "시간·강사 확인"}
            {step === 4 && "최종 확인"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-6">
          {step === 1 && (
            <Step1
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {step === 2 && (
            <Step2 formData={formData} updateFormData={updateFormData} />
          )}
          {step === 3 && (
            <Step3
              formData={formData}
              updateFormData={updateFormData}
              candidates={candidates ?? []}
              candidatesLoading={candidatesLoading}
            />
          )}
          {step === 4 && (
            <Step4
              formData={formData}
              onSubmit={handleSubmit}
              isSubmitting={mutation.isPending}
              is429={mutation.isError && (mutation.error as ApiError)?.status === 429}
              onRetry={handleSubmit}
            />
          )}
        </CardContent>

        <div className="flex justify-between border-t px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className={cn(
              step === 1 && "cursor-not-allowed text-muted-foreground"
            )}
          >
            이전
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
            >
              다음
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function Step1({
  formData,
  updateFormData,
}: {
  formData: Partial<CourseRegistrationRequest>;
  updateFormData: (d: Partial<CourseRegistrationRequest>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">
          수강 기간 (개월)
        </Label>
        <select
          value={formData.months ?? ""}
          onChange={(e) =>
            updateFormData({
              months: e.target.value ? Number(e.target.value) : undefined,
            })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">선택하세요</option>
          {MONTH_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}개월
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Step2({
  formData,
  updateFormData,
}: {
  formData: Partial<CourseRegistrationRequest>;
  updateFormData: (d: Partial<CourseRegistrationRequest>) => void;
}) {
  const toggleDay = (d: DayOfWeek) => {
    const current = formData.days ?? [];
    const next = current.includes(d)
      ? current.filter((x) => x !== d)
      : [...current, d];
    updateFormData({ days: next });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        희망 요일을 1개 이상 선택하세요.
      </p>
      <div className="flex flex-wrap gap-3">
        {DAYS_OF_WEEK.map((d) => (
          <label
            key={d}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              (formData.days ?? []).includes(d)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-foreground hover:bg-accent"
            )}
          >
            <input
              type="checkbox"
              checked={(formData.days ?? []).includes(d)}
              onChange={() => toggleDay(d)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            {DAY_LABELS[d]}
          </label>
        ))}
      </div>
    </div>
  );
}

function Step3({
  formData,
  updateFormData,
  candidates,
  candidatesLoading,
}: {
  formData: Partial<CourseRegistrationRequest>;
  updateFormData: (d: Partial<CourseRegistrationRequest>) => void;
  candidates: { id: string; name?: string }[];
  candidatesLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">
          희망 시작 시간
        </Label>
        <Input
          type="time"
          value={formData.startTime ?? ""}
          onChange={(e) => updateFormData({ startTime: e.target.value || undefined })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">
          수업 시간 (분)
        </Label>
        <select
          value={formData.durationMinutes ?? ""}
          onChange={(e) =>
            updateFormData({
              durationMinutes: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">선택하세요</option>
          {DURATION_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}분
            </option>
          ))}
        </select>
      </div>
      {formData.startTime &&
        typeof formData.durationMinutes === "number" &&
        formData.durationMinutes > 0 && (
          <div className="flex items-center gap-2">
            {candidatesLoading ? (
              <span className="text-sm text-muted-foreground">확인 중…</span>
            ) : candidates.length > 0 ? (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                신청 가능
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                해당 시간 가용 강사 없음
              </Badge>
            )}
          </div>
        )}
    </div>
  );
}

function Step4({
  formData,
  onSubmit,
  isSubmitting,
  is429,
  onRetry,
}: {
  formData: Partial<CourseRegistrationRequest>;
  onSubmit: () => void;
  isSubmitting: boolean;
  is429: boolean;
  onRetry: () => void;
}) {
  const days = formData.days ?? [];
  const dayStr = days.map((d) => DAY_LABELS[d]).join(", ");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-muted p-4 text-sm">
        <dl className="grid gap-2">
          <div>
            <dt className="font-medium text-muted-foreground">수강 기간</dt>
            <dd className="text-foreground">{formData.months}개월</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">희망 요일</dt>
            <dd className="text-foreground">{dayStr || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">시작 시간 / 수업 시간</dt>
            <dd className="text-foreground">
              {formData.startTime} / {formData.durationMinutes}분
            </dd>
          </div>
        </dl>
      </div>
      {is429 && (
        <p className="text-sm text-destructive">
          접속이 많아 처리되지 않았습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "처리 중…" : "신청하기"}
        </Button>
        {is429 && (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
            disabled={isSubmitting}
          >
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}
