"use client";

import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
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
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            수강 신청 마법사
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Step {step} / 4 —{" "}
            {step === 1 && "기간 선택"}
            {step === 2 && "요일 선택"}
            {step === 3 && "시간·강사 확인"}
            {step === 4 && "최종 확인"}
          </p>
        </div>

        <div className="px-6 py-6">
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
        </div>

        <div className="flex justify-between border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={clsx(
              "rounded-lg px-4 py-2 text-sm font-medium",
              step === 1
                ? "cursor-not-allowed text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            이전
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2) ||
                (step === 3 && !canProceedStep3)
              }
              className={clsx(
                "rounded-lg px-4 py-2 text-sm font-medium text-white",
                (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3)
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              다음
            </button>
          ) : null}
        </div>
      </div>
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
        <label className="text-sm font-medium text-gray-700">
          수강 기간 (개월)
        </label>
        <select
          value={formData.months ?? ""}
          onChange={(e) =>
            updateFormData({
              months: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
      <p className="text-sm text-gray-600">
        희망 요일을 1개 이상 선택하세요.
      </p>
      <div className="flex flex-wrap gap-3">
        {DAYS_OF_WEEK.map((d) => (
          <label
            key={d}
            className={clsx(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              (formData.days ?? []).includes(d)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <input
              type="checkbox"
              checked={(formData.days ?? []).includes(d)}
              onChange={() => toggleDay(d)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
        <label className="text-sm font-medium text-gray-700">
          희망 시작 시간
        </label>
        <input
          type="time"
          value={formData.startTime ?? ""}
          onChange={(e) => updateFormData({ startTime: e.target.value || undefined })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          수업 시간 (분)
        </label>
        <select
          value={formData.durationMinutes ?? ""}
          onChange={(e) =>
            updateFormData({
              durationMinutes: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              <span className="text-sm text-gray-500">확인 중…</span>
            ) : candidates.length > 0 ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                신청 가능
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                해당 시간 가용 강사 없음
              </span>
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
      <div className="rounded-lg bg-gray-50 p-4 text-sm">
        <dl className="grid gap-2">
          <div>
            <dt className="font-medium text-gray-500">수강 기간</dt>
            <dd className="text-gray-900">{formData.months}개월</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">희망 요일</dt>
            <dd className="text-gray-900">{dayStr || "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">시작 시간 / 수업 시간</dt>
            <dd className="text-gray-900">
              {formData.startTime} / {formData.durationMinutes}분
            </dd>
          </div>
        </dl>
      </div>
      {is429 && (
        <p className="text-sm text-amber-600">
          접속이 많아 처리되지 않았습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "처리 중…" : "신청하기"}
        </button>
        {is429 && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
