"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { getAvailability, updateAvailability } from "@/lib/teacher";
import {
  TeacherAvailabilityFormValues,
  TeacherAvailabilityResponse,
  DayAvailability,
} from "@/schema/teacher/teacher-availability";
import { ALL_DAYS_OF_WEEK, DayOfWeek } from "@/schema/common/day-of-week";
import { useToastStore } from "@/store/useToastStore";

/**
 * 강사 가용 시간 설정 조회
 */
export function useTeacherAvailability() {
  return useQuery<TeacherAvailabilityFormValues, Error>({
    queryKey: ["teacher", "availability"],
    queryFn: async () => {
      const responses = await getAvailability();
      
      // 서버 응답을 Form 구조로 변환
      // 서버에는 enabled=true인 것만 저장되어 있으므로, 모든 요일을 포함하도록 변환
      const availabilityMap = new Map<DayOfWeek, TeacherAvailabilityResponse>();
      responses.forEach((item) => {
        availabilityMap.set(item.dayOfWeek, item);
      });

      // 모든 요일을 포함한 Form 데이터 생성
      const availabilities = ALL_DAYS_OF_WEEK.map((day) => {
        const existing = availabilityMap.get(day);
        if (existing) {
          return {
            dayOfWeek: existing.dayOfWeek,
            enabled: true,
            startTime: existing.startTime,
            endTime: existing.endTime,
          };
        } else {
          // 서버에 없는 요일은 disabled로 설정
          return {
            dayOfWeek: day,
            enabled: false,
            startTime: "09:00",
            endTime: "18:00",
          };
        }
      });

      return { availabilities };
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 강사 가용 시간 설정 업데이트
 */
export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: async (data: TeacherAvailabilityFormValues) => {
      // enabled=true인 요청만 필터링하여 API에 전송
      const enabledAvailabilities: DayAvailability[] = data.availabilities
        .filter((item) => item.enabled)
        .map((item) => ({
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
          enabled: true,
        }));

      return await updateAvailability(enabledAvailabilities);
    },
    onSuccess: async () => {
      // 쿼리 무효화로 최신 데이터 갱신
      await queryClient.invalidateQueries({ queryKey: ["teacher", "availability"] });
      showToast("저장되었습니다.", "success");
    },
    onError: (error: ApiError) => {
      console.error("Failed to update availability:", error);
      showToast("저장에 실패했습니다.", "error");
    },
  });
}
