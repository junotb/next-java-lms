package org.junotb.api.course.web;

import org.junotb.api.course.CourseStatus;

public record CourseUpdateRequest(
    String title,
    String description,
    CourseStatus status
) {}
