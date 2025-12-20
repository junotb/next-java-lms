"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/libs/api";
import { scheduleList, scheduleInfo, scheduleCreate, scheduleUpdate, scheduleDelete } from "@/libs/schedule";
import { Schedule, ScheduleListRequest, ScheduleCreateRequest, ScheduleUpdateRequest } from "@/schemas/schedule";

// 사용자 목록 조회 훅
export function useScheduleList(filter: ScheduleListRequest) {
  return useQuery<Schedule[], Error>({
    queryKey: ["schedule", "list", filter],
    queryFn: () => scheduleList(filter),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

// 사용자 상세 조회 훅
export function useScheduleInfo(scheduleId: number, options?: { enabled?: boolean }) {
  return useQuery<Schedule, Error>({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => scheduleInfo(scheduleId),
    enabled: options?.enabled ?? scheduleId > 0,
  });
}

// 사용자 등록 훅
export function useScheduleCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleCreateRequest) => scheduleCreate(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: (error: ApiError) => {
      console.error(`Failed to register schedule: ${error.status} ${error.message}`);
    }
  });
}

// 사용자 수정 훅
export function useScheduleUpdate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ scheduleId, payload }: { scheduleId: number; payload: ScheduleUpdateRequest }) => scheduleUpdate(scheduleId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: (error: ApiError) => {
      console.error(`Failed to modify schedule: ${error.status} ${error.message}`);
    }
  });
}

// 사용자 삭제 훅
export function useScheduleDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (scheduleId: number) => scheduleDelete(scheduleId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["schedule"] });
    },
    onError: (error: ApiError) => {
      console.error(`Failed to delete schedule: ${error.status} ${error.message}`);
    }
  });
}

