import api from "@/lib/api";
import { PageResponseSchema } from "@/schema/common/page-response";
import {
  Course,
  CourseSchema,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseListRequest,
} from "@/schema/course/course";
import { CourseStatus } from "@/schema/course/course-status";

// 강의 목록 조회
export async function courseList(
  params: CourseListRequest
): Promise<Course[]> {
  try {
    const response = await api.get<Course[]>("/api/courses", { params });
    return PageResponseSchema(CourseSchema).parse(response.data).items;
  } catch (error) {
    console.error("Error get courses:", error);
    throw error;
  }
}

// 강의 정보 조회
export async function courseInfo(courseId: number): Promise<Course> {
  try {
    const response = await api.get<Course>(`/api/courses/${courseId}`);
    return CourseSchema.parse(response.data);
  } catch (error) {
    console.error("Error get course information:", error);
    throw error;
  }
}

// 강의 등록
export async function courseCreate(
  payload: CourseCreateRequest
): Promise<Course> {
  try {
    const response = await api.post<Course>("/api/courses", payload);
    return CourseSchema.parse(response.data);
  } catch (error) {
    console.error("Error create course:", error);
    throw error;
  }
}

// 강의 수정
export async function courseUpdate(
  courseId: number,
  payload: CourseUpdateRequest
): Promise<Course> {
  try {
    const response = await api.patch<Course>(
      `/api/courses/${courseId}`,
      payload
    );
    return CourseSchema.parse(response.data);
  } catch (error) {
    console.error("Error update course:", error);
    throw error;
  }
}

// 강의 삭제
export async function courseDelete(courseId: number): Promise<void> {
  try {
    await api.delete<void>(`/api/courses/${courseId}`);
  } catch (error) {
    console.error("Error delete course:", error);
    throw error;
  }
}

// 강의 상태별 통계
export async function courseStatusStats(): Promise<
  Record<CourseStatus, number>
> {
  try {
    const response = await api.get<Record<CourseStatus, number>>(
      "/api/courses/stats/status"
    );
    return response.data;
  } catch (error) {
    console.error("Error get course status stats:", error);
    throw error;
  }
}
