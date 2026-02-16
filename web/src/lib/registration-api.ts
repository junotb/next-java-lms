import { z } from "zod";
import api from "@/lib/api";
import { courseList } from "@/lib/course";
import type { Course } from "@/schemas/course/course";
import type { CourseStatus } from "@/schemas/course/course-status";
import {
  type CandidateSearchRequest,
  type CourseRegistrationRequest,
  type TeacherCandidate,
  TeacherCandidateSchema,
} from "@/schemas/registration";
import { RegistrationSchema, type Registration } from "@/schemas/registration";

/** 수강 신청 (강좌 기준, 강사 자동 매칭) */
export async function registerCourse(
  payload: CourseRegistrationRequest
): Promise<Registration> {
  const body = {
    courseId: payload.courseId,
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

/** 코스 목록 조회 (수강 신청 마법사 Step 1용). lib/course.courseList 재사용. */
export function getCourseListForRegistration(params?: {
  status?: CourseStatus;
  page?: number;
  size?: number;
}): Promise<Course[]> {
  return courseList({
    status: params?.status,
    page: params?.page ?? 0,
    size: params?.size ?? 100,
  });
}
