"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/libs/api";
import { scheduleList, scheduleInfo, scheduleCreate, scheduleUpdate, scheduleDelete, scheduleStatusStats } from "@/libs/schedule";
import { Schedule, ScheduleListRequest, ScheduleCreateRequest, ScheduleUpdateRequest } from "@/schemas/schedule/schedule";
import { ScheduleStatus } from "@/schemas/schedule/schedule-status";

// 스케줄 목록 조회
export function useScheduleList(request: ScheduleListRequest) {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedule", "list", request],
    queryFn: async () => await scheduleList(request),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

// 스케줄 상세 조회
export function useScheduleInfo(scheduleId: number, options?: { enabled?: boolean }) {
  return useQuery<Schedule, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => await scheduleInfo(scheduleId),
    enabled: options?.enabled ?? scheduleId > 0,
  });
}

// 스케줄 등록
export function useScheduleCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleCreateRequest) => scheduleCreate(payload),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["schedule"] }),
    onError: (error: ApiError) => console.error(`Failed to register schedule: ${error.status} ${error.message}`)
  });
}

// 스케줄 수정
export function useScheduleUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, payload }: { scheduleId: number; payload: ScheduleUpdateRequest }) => scheduleUpdate(scheduleId, payload),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["schedule"] }),
    onError: (error: ApiError) => console.error(`Failed to modify schedule: ${error.status} ${error.message}`)
  });
}

// 스케줄 삭제
export function useScheduleDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: number) => scheduleDelete(scheduleId),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["schedule"] }),
    onError: (error: ApiError) => console.error(`Failed to delete schedule: ${error.status} ${error.message}`)
  });
}

// 스케줄 상태별 통계
export function useScheduleStatusStats(request: ScheduleStatus | null) {
  return useQuery<Record<ScheduleStatus, number>, Error>({
    queryKey: ["schedule", "status-stats"],
    queryFn: async () => await scheduleStatusStats(request),
    enabled: true,
    staleTime: 10 * 60 * 1000,
  });
}