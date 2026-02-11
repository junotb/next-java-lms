package org.junotb.api.lesson.dto;

/**
 * 수업방에서 표시하는 강의 요약 정보.
 *
 * @param title       강의 제목
 * @param description 강의 설명 (nullable)
 */
public record CourseInLesson(
    String title,
    String description
) {}
