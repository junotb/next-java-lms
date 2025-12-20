import api from "@/libs/api";
import { PageResponse } from "@/schemas/page-response";
import { Schedule, ScheduleCreateRequest, ScheduleUpdateRequest, ScheduleListRequest } from "@/schemas/schedule";

// 스케줄 목록 조회
export async function scheduleList(params: ScheduleListRequest): Promise<Schedule[]> {
  try {
    const response = await api.get<Schedule[]>("/api/schedule", { params });
    return PageResponse(Schedule).parse(response.data).items;
  } catch (error) {
    console.error("Error get schedules:", error);
    throw error;
  }
}

// 사용자 정보 조회
export async function scheduleInfo(scheduleId: number): Promise<Schedule> {
  try {
    const response = await api.get<Schedule>(`/api/schedule/${scheduleId}`);
    return Schedule.parse(response.data);
  } catch (error) {
    console.error("Error get schedule information:", error);
    throw error;
  }
}

// 스케줄 등록
export async function scheduleCreate(payload: ScheduleCreateRequest): Promise<Schedule> {
  try {
    const response = await api.post<Schedule>("/api/schedule", payload);
    return Schedule.parse(response.data);
  } catch (error) {
    console.error("Error create schedule:", error);
    throw error;
  }
}

// 사용자 정보 수정
export async function scheduleUpdate(scheduleId: number, payload: ScheduleUpdateRequest): Promise<Schedule> {
  try {
    const response = await api.patch<Schedule>(`/api/schedule/${scheduleId}`, payload);
    return Schedule.parse(response.data);
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