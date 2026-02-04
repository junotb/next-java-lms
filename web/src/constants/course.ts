import { CourseStatus } from "@/schema/course/course-status";

// 강의 상태 한글 명칭
export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

// 강의 상태 색상 (Tailwind 클래스)
export const COURSE_STATUS_COLORS: Record<CourseStatus, string> = {
  ACTIVE: "bg-primary/10 text-primary",
  INACTIVE: "bg-destructive/10 text-destructive",
};
