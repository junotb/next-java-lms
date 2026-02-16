import { ROLE_REDIRECT_MAP } from "@/constants/auth";
import type { UserRole } from "@/schemas/user/user-role";

/**
 * 역할에 따른 설정 경로 prefix 반환
 * @example getSettingsPath("ADMIN") → "/admin/settings"
 */
export function getSettingsPath(role: UserRole): string {
  return `${ROLE_REDIRECT_MAP[role]}/settings`;
}

/**
 * 역할에 따른 피드백 경로 반환
 * @example getFeedbackPath("TEACHER", 123) → "/teach/feedback/123"
 */
export function getFeedbackPath(role: UserRole, scheduleId: number): string {
  return `${ROLE_REDIRECT_MAP[role]}/feedback/${scheduleId}`;
}

/**
 * 역할에 따른 수업실 경로 반환
 * @example getClassroomPath("STUDENT", 456) → "/study/classroom/456"
 */
export function getClassroomPath(role: UserRole, id: number): string {
  return `${ROLE_REDIRECT_MAP[role]}/classroom/${id}`;
}
