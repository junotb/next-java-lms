package org.junotb.api.lesson.dto;

/**
 * 수업방에서 표시하는 강좌 요약 정보.
 *
 * @param title       강좌 제목
 * @param description 강좌 설명 (nullable)
 */
public record CourseInLesson(
    String title,
    String description
) {}
