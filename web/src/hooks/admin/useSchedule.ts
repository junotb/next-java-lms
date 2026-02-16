"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleList, scheduleInfo, scheduleCreate, scheduleUpdate, scheduleDelete, scheduleStatusStats } from "@/lib/schedule";
import { Schedule, ScheduleListRequest, ScheduleCreateRequest, ScheduleUpdateRequest } from "@/schemas/schedule/schedule";
import { ScheduleStatus } from "@/schemas/schedule/schedule-status";
import { STALE_TIME_LIST, STALE_TIME_STATS } from "@/constants/config";
import { toast } from "sonner";

/**
 * 수업 목록 조회.
 * @param request - 목록 필터/페이지 조건
 */
export function useScheduleList(request: ScheduleListRequest) {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedule", "list", request],
    queryFn: async () => await scheduleList(request),
    enabled: true,
    staleTime: STALE_TIME_LIST,
  });
}

/**
 * 수업 상세 조회.
 * @param scheduleId - 수업 ID
 * @param options.enabled - 쿼리 실행 여부
 */
export function useScheduleInfo(scheduleId: number, options?: { enabled?: boolean }) {
  return useQuery<Schedule, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => await scheduleInfo(scheduleId),
    enabled: options?.enabled ?? scheduleId > 0,
  });
}

/**
 * 수업 등록.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useScheduleCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleCreateRequest) => scheduleCreate(payload),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["schedule"] }),
    onError: (err) => {
      toast.error(err?.message ?? "수업 등록에 실패했습니다.");
    },
  });
}

/**
 * 수업 수정.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useScheduleUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, payload }: { scheduleId: number; payload: ScheduleUpdateRequest }) => scheduleUpdate(scheduleId, payload),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["schedule"] }),
    onError: (err) => {
      toast.error(err?.message ?? "수업 수정에 실패했습니다.");
    },
  });
}

/**
 * 수업 삭제.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useScheduleDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: number) => scheduleDelete(scheduleId),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["schedule"] }),
    onError: (err) => {
      toast.error(err?.message ?? "수업 삭제에 실패했습니다.");
    },
  });
}

/**
 * 수업 상태별 통계.
 * 대시보드 등에서 사용.
 */
export function useScheduleStatusStats() {
  return useQuery<Record<ScheduleStatus, number>, Error>({
    queryKey: ["schedule", "status-stats"],
    queryFn: scheduleStatusStats,
    enabled: true,
    staleTime: STALE_TIME_STATS,
  });
}