package org.junotb.api.lesson.dto;

import org.junotb.api.schedule.web.ScheduleResponse;

/**
 * 수업방 입장 권한 검증 결과 DTO.
 *
 * @param allowed   입장 가능 여부
 * @param role      TEACHER | STUDENT
 * @param schedule  스케줄 정보
 * @param meetLink  Google Meet 링크 (강사가 등록한 경우). 수업방에서 링크 전달용.
 * @param course    강의 정보 (제목, 설명). 수업방 상단 표시용.
 */
public record LessonAccessResponse(
    boolean allowed,
    String role,
    ScheduleResponse schedule,
    String meetLink,
    CourseInLesson course
) {}
