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
} from "@/schema/course/course";
import { CourseStatus } from "@/schema/course/course-status";

// 강의 목록 조회
export function useCourseList(request: CourseListRequest) {
  return useQuery<Course[], Error>({
    queryKey: ["course", "list", request],
    queryFn: async () => await courseList(request),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

// 강의 상세 조회
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

// 강의 등록
export function useCourseCreate() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseCreateRequest) => courseCreate(payload),
    onSuccess: async () =>
      await qc.invalidateQueries({ queryKey: ["course"] }),
    onError: () => {},
  });
}

// 강의 수정
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
    onError: () => {},
  });
}

// 강의 삭제
export function useCourseDelete() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: number) => courseDelete(courseId),
    onSuccess: async () =>
      await qc.invalidateQueries({ queryKey: ["course"] }),
    onError: () => {},
  });
}

// 강의 상태별 통계
export function useCourseStatusStats() {
  return useQuery<Record<CourseStatus, number>, Error>({
    queryKey: ["course", "status-stats"],
    queryFn: async () => await courseStatusStats(),
    enabled: true,
    staleTime: 10 * 60 * 1000,
  });
}
