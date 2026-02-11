import api from "@/lib/api";
import {
  StudyDashboardResponseSchema,
  TeachDashboardResponseSchema,
  type StudyDashboardResponse,
  type TeachDashboardResponse,
} from "@/schemas/dashboard/dashboard";

export async function getStudyDashboard(): Promise<StudyDashboardResponse> {
  const response = await api.get<StudyDashboardResponse>("/api/v1/study/dashboard");
  return StudyDashboardResponseSchema.parse(response.data);
}

export async function getTeachDashboard(): Promise<TeachDashboardResponse> {
  const response = await api.get<unknown>("/api/v1/teach/dashboard");
  const parsed = TeachDashboardResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error("[getTeachDashboard] Schema validation failed:", parsed.error.format());
    throw new Error(
      `대시보드 응답 형식 오류: ${parsed.error.issues.map((i) => i.message).join(", ")}`
    );
  }
  return parsed.data;
}
