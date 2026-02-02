import { z } from "zod";
import api from "@/lib/api";
import { CourseSchema, type Course } from "@/schema/course/course";
import {
  type CandidateSearchRequest,
  type CourseRegistrationRequest,
  type TeacherCandidate,
  TeacherCandidateSchema,
} from "@/schema/registration";
import { RegistrationSchema, type Registration } from "@/schema/registration";

/** 수강 신청 (강좌 기준, 강사 자동 매칭) */
export async function registerCourse(
  payload: CourseRegistrationRequest & { courseId?: number }
): Promise<Registration> {
  const body = {
    courseId: payload.courseId ?? 1, // courseId가 없으면 기본값 1 사용
    months: payload.months,
    days: payload.days,
    startTime: payload.startTime,
    durationMinutes: payload.durationMinutes,
  };
  const response = await api.post<Registration>("/api/registrations/course", body);
  return RegistrationSchema.parse(response.data);
}

/** 해당 시간/요일에 가용한 강사 후보 조회 */
export async function findCandidates(
  params: CandidateSearchRequest
): Promise<TeacherCandidate[]> {
  const { days, startTime, durationMinutes } = params;
  const response = await api.get<TeacherCandidate[] | { content: TeacherCandidate[] }>(
    "/api/v1/teachers/candidates",
    {
      params: {
        days: days.join(","),
        startTime,
        durationMinutes,
      },
    }
  );
  const raw = Array.isArray(response.data)
    ? response.data
    : (response.data as { content?: TeacherCandidate[] }).content ?? [];
  return z.array(TeacherCandidateSchema).parse(raw);
}

/** 코스 목록 조회 (수강 신청 마법사 Step 1용) */
export async function courseList(params?: {
  status?: "OPEN" | "CLOSED";
  page?: number;
  size?: number;
}): Promise<Course[]> {
  const response = await api.get<{ content: unknown[] }>("/api/courses", {
    params: {
      status: params?.status,
      page: params?.page ?? 0,
      size: params?.size ?? 100,
    },
  });
  const content = response.data.content ?? [];
  return z.array(CourseSchema).parse(content);
}
