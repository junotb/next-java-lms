"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/lib/api";
import {
  getTeacherTimeOffList,
  createTeacherTimeOff,
  deleteTeacherTimeOff,
} from "@/lib/teacher-time-off";
import type { TeacherTimeOffResponse, TeacherTimeOffRequest } from "@/schema/teacher/time-off";
import { useToastStore } from "@/store/useToastStore";

const QUERY_KEY = ["teacher", "time-off"];

export function useTeacherTimeOffList() {
  return useQuery<TeacherTimeOffResponse[], Error>({
    queryKey: QUERY_KEY,
    queryFn: getTeacherTimeOffList,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateTeacherTimeOff() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (data: TeacherTimeOffRequest) => createTeacherTimeOff(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      showToast("휴무가 등록되었습니다.", "success");
    },
    onError: (error: ApiError) => {
      showToast(error.message || "휴무 등록에 실패했습니다.", "error");
    },
  });
}

export function useDeleteTeacherTimeOff() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (id: number) => deleteTeacherTimeOff(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      showToast("휴무가 삭제되었습니다.", "success");
    },
    onError: (error: ApiError) => {
      showToast(error.message || "휴무 삭제에 실패했습니다.", "error");
    },
  });
}
