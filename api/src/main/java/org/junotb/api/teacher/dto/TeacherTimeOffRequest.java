package org.junotb.api.teacher.dto;

import jakarta.validation.constraints.NotNull;
import org.junotb.api.user.TeacherTimeOffType;

import java.time.LocalDateTime;

public record TeacherTimeOffRequest(
    @NotNull(message = "시작 일시는 필수입니다.")
    LocalDateTime startDateTime,
    
    @NotNull(message = "종료 일시는 필수입니다.")
    LocalDateTime endDateTime,
    
    @NotNull(message = "휴무 타입은 필수입니다.")
    TeacherTimeOffType type,
    
    String reason
) {
}
