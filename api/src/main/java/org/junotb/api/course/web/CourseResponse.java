package org.junotb.api.course.web;

import org.junotb.api.course.Course;
import org.junotb.api.course.CourseStatus;

import java.time.OffsetDateTime;

public record CourseResponse(
    Long id,
    String title,
    String description,
    CourseStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static CourseResponse from(Course course) {
        return new CourseResponse(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getStatus(),
            course.getCreatedAt(),
            course.getUpdatedAt()
        );
    }
}
