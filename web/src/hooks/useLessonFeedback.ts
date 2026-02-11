"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadLessonVideo, getLessonFeedback } from "@/lib/lesson";
import { useToastStore } from "@/stores/useToastStore";

export function useVideoUpload(scheduleId: number | null) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  return useMutation({
    mutationFn: (file: File) => {
      if (scheduleId == null) throw new Error("scheduleId required");
      return uploadLessonVideo(scheduleId, file);
    },
    onSuccess: async () => {
      if (scheduleId != null) {
        await queryClient.invalidateQueries({
          queryKey: ["lesson-feedback", scheduleId],
        });
        await queryClient.invalidateQueries({ queryKey: ["teach", "dashboard"] });
      }
      showToast("영상 업로드가 시작되었습니다. 피드백 생성에 몇 분이 소요될 수 있습니다.", "success");
    },
    onError: () => {
      showToast("영상 업로드에 실패했습니다.", "error");
    },
  });
}

export function useLessonFeedback(scheduleId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["lesson-feedback", scheduleId],
    queryFn: () => getLessonFeedback(scheduleId!),
    enabled: (options?.enabled ?? true) && scheduleId != null && scheduleId > 0,
  });
}
