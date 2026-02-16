"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkLessonAccess, finishLesson } from "@/lib/lesson";
import { toast } from "sonner";
import type { LessonAccessResponse } from "@/schemas/lesson/lesson";

export function useLessonAccess(scheduleId: number | null, options?: { enabled?: boolean }) {
  const router = useRouter();
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
      toast.error(msg);
    }
  }, [query.isError, query.error]);

  useEffect(() => {
    if (!query.data || query.isLoading) return;
    if (!query.data.allowed) {
      toast.error("입장할 수 없는 수업이거나 시간이 아닙니다.");
      router.back();
    }
  }, [query.data, query.isLoading, router]);

  return query;
}

export function useFinishLesson(scheduleId: number | null) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => finishLesson(scheduleId!),
    onSuccess: () => {
      toast.success("수업이 종료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["lesson", "access", scheduleId] });
      router.push("/teach");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "수업 종료에 실패했습니다.");
    },
  });
}
