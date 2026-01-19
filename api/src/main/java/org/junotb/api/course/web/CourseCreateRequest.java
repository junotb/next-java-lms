package org.junotb.api.course.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.junotb.api.course.CourseStatus;

public record CourseCreateRequest(
    @NotBlank(message = "Title is required")
    String title,
    
    String description,
    
    @NotNull(message = "Status is required")
    CourseStatus status
) {}
