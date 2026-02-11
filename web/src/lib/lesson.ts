import api from "@/lib/api";
import {
  LessonAccessResponse,
  LessonAccessResponseSchema,
} from "@/schemas/lesson/lesson";
import {
  LessonFeedbackResponse,
  LessonFeedbackResponseSchema,
  VideoUploadResponse,
  VideoUploadResponseSchema,
} from "@/schemas/lesson/lesson-feedback";

export async function checkLessonAccess(
  scheduleId: number
): Promise<LessonAccessResponse> {
  const response = await api.get<LessonAccessResponse>(
    `/api/v1/lessons/${scheduleId}/access`
  );
  return LessonAccessResponseSchema.parse(response.data);
}

export async function finishLesson(scheduleId: number): Promise<void> {
  await api.post<void>(`/api/v1/lessons/${scheduleId}/finish`);
}

export async function uploadLessonVideo(
  scheduleId: number,
  file: File
): Promise<VideoUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<VideoUploadResponse>(
    `/api/v1/lessons/${scheduleId}/video`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return VideoUploadResponseSchema.parse(response.data);
}

export async function getLessonFeedback(
  scheduleId: number
): Promise<LessonFeedbackResponse> {
  const response = await api.get<LessonFeedbackResponse>(
    `/api/v1/lessons/${scheduleId}/feedback`
  );
  return LessonFeedbackResponseSchema.parse(response.data);
}
