import api from "@/lib/api";
import { z } from "zod";
import {
  TeacherTimeOffResponse,
  TeacherTimeOffResponseSchema,
  TeacherTimeOffRequest,
} from "@/schemas/teacher/time-off";
import { TEACHER_TIME_OFF_BASE_URL } from "@/constants/api";

const BASE_URL = TEACHER_TIME_OFF_BASE_URL;

export async function getTeacherTimeOffList(): Promise<TeacherTimeOffResponse[]> {
  const response = await api.get<TeacherTimeOffResponse[]>(BASE_URL);
  return z.array(TeacherTimeOffResponseSchema).parse(response.data);
}

export async function createTeacherTimeOff(
  data: TeacherTimeOffRequest
): Promise<TeacherTimeOffResponse> {
  const payload = {
    startDateTime: formatLocalDateTime(data.startDateTime),
    endDateTime: formatLocalDateTime(data.endDateTime),
    type: data.type,
    reason: data.reason ?? null,
  };
  const response = await api.post<TeacherTimeOffResponse>(BASE_URL, payload);
  return TeacherTimeOffResponseSchema.parse(response.data);
}

export async function deleteTeacherTimeOff(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
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
