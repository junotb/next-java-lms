"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiError } from "@/types/api";
import {
  courseList,
  findCandidates,
  registerCourse,
} from "@/lib/registration-api";
import type { CandidateSearchRequest } from "@/schema/registration";
import type { Course } from "@/schema/course/course";
import type { CourseRegistrationRequest } from "@/schema/registration";
import type { Registration } from "@/schema/registration";
import type { TeacherCandidate } from "@/schema/registration";

export function useCourseList() {
  return useQuery<Course[], Error>({
    queryKey: ["course", "list"],
    queryFn: () => courseList({ status: "ACTIVE", size: 100 }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFindCandidates(
  params: CandidateSearchRequest | null,
  enabled: boolean
) {
  return useQuery<TeacherCandidate[], Error>({
    queryKey: ["teachers", "candidates", params],
    queryFn: () => findCandidates(params!),
    enabled: enabled && !!params && params.days.length > 0 && !!params.startTime && params.durationMinutes > 0,
    staleTime: 60 * 1000,
  });
}

export function useRegisterCourse() {
  const qc = useQueryClient();
  return useMutation<Registration, ApiError, CourseRegistrationRequest>({
    mutationFn: (payload) => registerCourse(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["teachers", "candidates"] });
    },
  });
}
