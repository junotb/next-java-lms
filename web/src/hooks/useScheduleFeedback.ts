"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadLessonVideo, getScheduleFeedback } from "@/lib/lesson";
import { toast } from "sonner";

export function useVideoUpload(scheduleId: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      if (scheduleId == null) throw new Error("scheduleId required");
      return uploadLessonVideo(scheduleId, file);
    },
    onSuccess: async () => {
      if (scheduleId != null) {
        await queryClient.invalidateQueries({
          queryKey: ["schedule-feedback", scheduleId],
        });
        await queryClient.invalidateQueries({ queryKey: ["teach", "dashboard"] });
      }
      toast.success("영상 업로드가 시작되었습니다. 피드백 생성에 몇 분이 소요될 수 있습니다.");
    },
    onError: () => {
      toast.error("영상 업로드에 실패했습니다.");
    },
  });
}

export function useScheduleFeedback(scheduleId: number | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["schedule-feedback", scheduleId],
    queryFn: () => getScheduleFeedback(scheduleId!),
    enabled: (options?.enabled ?? true) && scheduleId != null && scheduleId > 0,
  });
}
