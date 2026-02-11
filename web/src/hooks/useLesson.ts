"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkLessonAccess, finishLesson } from "@/lib/lesson";
import { useToastStore } from "@/stores/useToastStore";
import type { LessonAccessResponse } from "@/schemas/lesson/lesson";

export function useLessonAccess(scheduleId: number | null, options?: { enabled?: boolean }) {
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);

  const query = useQuery<LessonAccessResponse, Error>({
    queryKey: ["lesson", "access", scheduleId],
    queryFn: () => checkLessonAccess(scheduleId!),
    enabled: (options?.enabled ?? true) && scheduleId != null && scheduleId > 0,
    retry: false,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      const err = query.error as { message?: string };
      const msg = err?.message ?? "수업 정보를 불러올 수 없습니다.";
      showToast(msg, "error");
    }
  }, [query.isError, query.error, showToast]);

  useEffect(() => {
    if (!query.data || query.isLoading) return;
    if (!query.data.allowed) {
      showToast("입장할 수 없는 수업이거나 시간이 아닙니다.", "error");
      router.back();
    }
  }, [query.data, query.isLoading, showToast, router]);

  return query;
}

export function useFinishLesson(scheduleId: number | null) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const showToast = useToastStore((s) => s.showToast);

  return useMutation({
    mutationFn: () => finishLesson(scheduleId!),
    onSuccess: () => {
      showToast("수업이 종료되었습니다.", "success");
      queryClient.invalidateQueries({ queryKey: ["lesson", "access", scheduleId] });
      router.push("/teach");
    },
    onError: (err: { message?: string }) => {
      showToast(err?.message ?? "수업 종료에 실패했습니다.", "error");
    },
  });
}
