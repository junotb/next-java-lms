"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  courseList,
  courseInfo,
  courseCreate,
  courseUpdate,
  courseDelete,
  courseStatusStats,
} from "@/lib/course";
import {
  Course,
  CourseListRequest,
  CourseCreateRequest,
  CourseUpdateRequest,
} from "@/schemas/course/course";
import { CourseStatus } from "@/schemas/course/course-status";
import { STALE_TIME_LIST, STALE_TIME_STATS } from "@/constants/config";
import { toast } from "sonner";

/**
 * 강좌 목록 조회.
 * @param request - 목록 필터/페이지 조건
 * @returns TanStack Query 결과
 */
export function useCourseList(request: CourseListRequest) {
  return useQuery<Course[], Error>({
    queryKey: ["course", "list", request],
    queryFn: async () => await courseList(request),
    enabled: true,
    staleTime: STALE_TIME_LIST,
  });
}

/**
 * 강좌 상세 조회.
 * @param courseId - 강좌 ID
 * @param options.enabled - 쿼리 실행 여부
 */
export function useCourseInfo(
  courseId: number,
  options?: { enabled?: boolean }
) {
  return useQuery<Course, Error>({
    queryKey: ["course", courseId],
    queryFn: async () => await courseInfo(courseId),
    enabled: options?.enabled ?? courseId > 0,
  });
}

/**
 * 강좌 등록.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useCourseCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CourseCreateRequest) => courseCreate(payload),
    onSuccess: async () =>
      await qc.invalidateQueries({ queryKey: ["course"] }),
    onError: (err) => {
      toast.error(err?.message ?? "강좌 등록에 실패했습니다.");
    },
  });
}

/**
 * 강좌 수정.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useCourseUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      payload,
    }: {
      courseId: number;
      payload: CourseUpdateRequest;
    }) => courseUpdate(courseId, payload),
    onSuccess: async () =>
      await qc.invalidateQueries({ queryKey: ["course"] }),
    onError: (err) => {
      toast.error(err?.message ?? "강좌 수정에 실패했습니다.");
    },
  });
}

/**
 * 강좌 삭제.
 * 성공 시 목록 캐시 무효화. 에러 시 Toast 표시.
 */
export function useCourseDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: number) => courseDelete(courseId),
    onSuccess: async () =>
      await qc.invalidateQueries({ queryKey: ["course"] }),
    onError: (err) => {
      toast.error(err?.message ?? "강좌 삭제에 실패했습니다.");
    },
  });
}

/**
 * 강좌 상태별 통계.
 * 대시보드 등에서 사용.
 */
export function useCourseStatusStats() {
  return useQuery<Record<CourseStatus, number>, Error>({
    queryKey: ["course", "status-stats"],
    queryFn: async () => await courseStatusStats(),
    enabled: true,
    staleTime: STALE_TIME_STATS,
  });
}
