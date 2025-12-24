import api from "@/libs/api";
import { PageResponseSchema } from "@/schemas/page-response";
import { Schedule, ScheduleSchema, ScheduleCreateRequest, ScheduleUpdateRequest, ScheduleListRequest } from "@/schemas/schedule/schedule";
import { ScheduleStatus } from "@/schemas/schedule/schedule-status";

// 스케줄 목록 조회
export async function scheduleList(params: ScheduleListRequest): Promise<Schedule[]> {
  try {
    const response = await api.get<Schedule[]>("/api/schedule", { params });
    return PageResponseSchema(ScheduleSchema).parse(response.data).items;
  } catch (error) {
    console.error("Error get schedules:", error);
    throw error;
  }
}

// 사용자 정보 조회
export async function scheduleInfo(scheduleId: number): Promise<Schedule> {
  try {
    const response = await api.get<Schedule>(`/api/schedule/${scheduleId}`);
    return ScheduleSchema.parse(response.data);
  } catch (error) {
    console.error("Error get schedule information:", error);
    throw error;
  }
}

// 스케줄 등록
export async function scheduleCreate(payload: ScheduleCreateRequest): Promise<Schedule> {
  try {
    const response = await api.post<Schedule>("/api/schedule", payload);
    return ScheduleSchema.parse(response.data);
  } catch (error) {
    console.error("Error create schedule:", error);
    throw error;
  }
}

// 사용자 정보 수정
export async function scheduleUpdate(scheduleId: number, payload: ScheduleUpdateRequest): Promise<Schedule> {
  try {
    const response = await api.patch<Schedule>(`/api/schedule/${scheduleId}`, payload);
    return ScheduleSchema.parse(response.data);
  } catch (error) {
    console.error("Error update schedule:", error);
    throw error;
  }
}

// 스케줄 삭제
export async function scheduleDelete(scheduleId: number): Promise<void> {
  try {
    await api.delete<void>(`/api/schedule/${scheduleId}`);
  } catch (error) {
    console.error("Error delete schedule:", error);
    throw error;
  }
}

// 스케줄 상태별 통계
export async function scheduleStatusStats(params: ScheduleStatus | null): Promise<Record<ScheduleStatus, number>> {
  try {
    const response = await api.get<Record<ScheduleStatus, number>>("/api/schedule/stats/status", { params });
    return response.data;
  } catch (error) {
    console.error("Error get schedule status stats:", error);
    throw error;
  }
}

// 스케줄 상태명 변환
export function getScheduleStatusName(status: ScheduleStatus): string {
  switch (status) {
    case "SCHEDULED":
      return "예정됨";
    case "ATTENDED":
      return "출석";
    case "ABSENT":
      return "결석";
    case "CANCELLED":
      return "취소됨";
    default:
      return "알 수 없음";
  }
}

// ISO 문자열을 날짜-시간 로컬 문자열로 변환
export function toDatetimeLocal(value: number | string) {
  if (!value) return undefined;
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
