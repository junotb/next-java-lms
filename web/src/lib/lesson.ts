import api from "@/lib/api";
import { LessonAccessResponse, LessonAccessResponseSchema } from "@/schema/lesson/lesson";

export async function checkLessonAccess(scheduleId: number): Promise<LessonAccessResponse> {
  const response = await api.get<LessonAccessResponse>(`/api/v1/lessons/${scheduleId}/access`);
  return LessonAccessResponseSchema.parse(response.data);
}

export async function finishLesson(scheduleId: number): Promise<void> {
  await api.post<void>(`/api/v1/lessons/${scheduleId}/finish`);
}
