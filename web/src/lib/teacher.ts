import api from "@/lib/api";
import { z } from "zod";
import {
  TeacherAvailabilityResponse,
  TeacherAvailabilityResponseSchema,
  DayAvailability,
} from "@/schemas/teacher/teacher-availability";

// 강사 가용 시간 설정 조회
export async function getAvailability(): Promise<TeacherAvailabilityResponse[]> {
  try {
    const response = await api.get<TeacherAvailabilityResponse[]>("/api/v1/teachers/me/availability");
    return z.array(TeacherAvailabilityResponseSchema).parse(response.data);
  } catch (error) {
    throw error;
  }
}

// 강사 가용 시간 설정 업데이트
export async function updateAvailability(
  data: DayAvailability[]
): Promise<TeacherAvailabilityResponse[]> {
  try {
    const response = await api.put<TeacherAvailabilityResponse[]>(
      "/api/v1/teachers/me/availability",
      data
    );
    return z.array(TeacherAvailabilityResponseSchema).parse(response.data);
  } catch (error) {
    throw error;
  }
}
