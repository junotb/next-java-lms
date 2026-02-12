import api from "@/lib/api";
import { PageResponseSchema } from "@/schemas/common/page-response";
import {
  Schedule,
  ScheduleSchema,
  ScheduleCreateRequest,
  ScheduleUpdateRequest,
  ScheduleListRequest,
  ScheduleMeetLinkRequest,
} from "@/schemas/schedule/schedule";
import { ScheduleStatus } from "@/schemas/schedule/schedule-status";

// 스케줄 목록 조회
export async function scheduleList(
  params: ScheduleListRequest
): Promise<Schedule[]> {
  const response = await api.get<Schedule[]>("/api/v1/schedule", { params });
  return PageResponseSchema(ScheduleSchema).parse(response.data).items;
}

// 스케줄 정보 조회
export async function scheduleInfo(scheduleId: number): Promise<Schedule> {
  const response = await api.get<Schedule>(`/api/v1/schedule/${scheduleId}`);
  return ScheduleSchema.parse(response.data);
}

// 스케줄 등록
export async function scheduleCreate(
  payload: ScheduleCreateRequest
): Promise<Schedule> {
  const response = await api.post<Schedule>("/api/v1/schedule", payload);
  return ScheduleSchema.parse(response.data);
}

// Meet 링크 수정 (강사 전용)
export async function scheduleMeetLinkUpdate(
  scheduleId: number,
  payload: ScheduleMeetLinkRequest
): Promise<Schedule> {
  const response = await api.patch<Schedule>(`/api/v1/schedule/${scheduleId}/meet-link`, payload);
  return ScheduleSchema.parse(response.data);
}

// 스케줄 수정
export async function scheduleUpdate(
  scheduleId: number,
  payload: ScheduleUpdateRequest
): Promise<Schedule> {
  const response = await api.patch<Schedule>(
    `/api/v1/schedule/${scheduleId}`,
    payload
  );
  return ScheduleSchema.parse(response.data);
}

// 스케줄 삭제
export async function scheduleDelete(scheduleId: number): Promise<void> {
  await api.delete<void>(`/api/v1/schedule/${scheduleId}`);
}

// 스케줄 상태별 통계
export async function scheduleStatusStats(): Promise<Record<ScheduleStatus, number>> {
  const response = await api.get<Record<ScheduleStatus, number>>("/api/v1/schedule/stats/status");
  return response.data;
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
