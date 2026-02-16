import api from "@/lib/api";
import { z } from "zod";
import {
  TeacherAvailabilityResponse,
  TeacherAvailabilityResponseSchema,
  DayAvailability,
} from "@/schemas/teacher/teacher-availability";
import {
  TeacherTimeOffResponse,
  TeacherTimeOffResponseSchema,
  TeacherTimeOffRequest,
} from "@/schemas/teacher/time-off";
import { TEACHER_TIME_OFF_BASE_URL } from "@/constants/api";

// 강사 가용 시간 설정 조회
export async function getAvailability(): Promise<TeacherAvailabilityResponse[]> {
  const response = await api.get<TeacherAvailabilityResponse[]>(
    "/api/v1/teachers/me/availability"
  );
  return z.array(TeacherAvailabilityResponseSchema).parse(response.data);
}

// 강사 가용 시간 설정 업데이트
export async function updateAvailability(
  data: DayAvailability[]
): Promise<TeacherAvailabilityResponse[]> {
  const response = await api.put<TeacherAvailabilityResponse[]>(
    "/api/v1/teachers/me/availability",
    data
  );
  return z.array(TeacherAvailabilityResponseSchema).parse(response.data);
}

// 강사 휴무 목록 조회
export async function getTeacherTimeOffList(): Promise<TeacherTimeOffResponse[]> {
  const response = await api.get<TeacherTimeOffResponse[]>(
    TEACHER_TIME_OFF_BASE_URL
  );
  return z.array(TeacherTimeOffResponseSchema).parse(response.data);
}

// 강사 휴무 등록
export async function createTeacherTimeOff(
  data: TeacherTimeOffRequest
): Promise<TeacherTimeOffResponse> {
  const payload = {
    startDateTime: formatLocalDateTime(data.startDateTime),
    endDateTime: formatLocalDateTime(data.endDateTime),
    type: data.type,
    reason: data.reason ?? null,
  };
  const response = await api.post<TeacherTimeOffResponse>(
    TEACHER_TIME_OFF_BASE_URL,
    payload
  );
  return TeacherTimeOffResponseSchema.parse(response.data);
}

// 강사 휴무 삭제
export async function deleteTeacherTimeOff(id: number): Promise<void> {
  await api.delete(`${TEACHER_TIME_OFF_BASE_URL}/${id}`);
}

function formatLocalDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}
