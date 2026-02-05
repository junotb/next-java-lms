package org.junotb.api.lesson.dto;

import org.junotb.api.course.web.CourseResponse;
import org.junotb.api.schedule.web.ScheduleResponse;

/**
 * 수업방 입장 권한 검증 결과 DTO.
 */
public record LessonAccessResponse(
    boolean allowed,
    String role,
    ScheduleResponse schedule,
    CourseResponse course
) {}
