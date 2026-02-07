"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleMeetLinkUpdate } from "@/lib/schedule";
import type { ScheduleMeetLinkRequest } from "@/schema/schedule/schedule";
import { useToastStore } from "@/store/useToastStore";

/**
 * 강사 전용. Meet 링크 등록/수정 mutation.
 * 성공 시 teach 대시보드 쿼리 무효화.
 */
export function useMeetLinkUpdate() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  return useMutation({
    mutationFn: ({ scheduleId, payload }: { scheduleId: number; payload: ScheduleMeetLinkRequest }) =>
      scheduleMeetLinkUpdate(scheduleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teach", "dashboard"] });
      showToast("Meet 링크가 등록되었습니다.", "success");
    },
    onError: () => {
      showToast("Meet 링크 등록에 실패했습니다.", "error");
    },
  });
}
