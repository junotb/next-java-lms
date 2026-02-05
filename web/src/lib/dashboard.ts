import api from "@/lib/api";
import {
  StudyDashboardResponseSchema,
  TeachDashboardResponseSchema,
  type StudyDashboardResponse,
  type TeachDashboardResponse,
} from "@/schema/dashboard/dashboard";

export async function getStudyDashboard(): Promise<StudyDashboardResponse> {
  const response = await api.get<StudyDashboardResponse>("/api/v1/study/dashboard");
  return StudyDashboardResponseSchema.parse(response.data);
}

export async function getTeachDashboard(): Promise<TeachDashboardResponse> {
  const response = await api.get<TeachDashboardResponse>("/api/v1/teach/dashboard");
  return TeachDashboardResponseSchema.parse(response.data);
}
