package org.junotb.api.teacher.dto;

import org.junotb.api.user.TeacherTimeOff;
import org.junotb.api.user.TeacherTimeOffType;

import java.time.LocalDateTime;

public record TeacherTimeOffResponse(
    Long id,
    LocalDateTime startDateTime,
    LocalDateTime endDateTime,
    TeacherTimeOffType type,
    String reason
) {
    public static TeacherTimeOffResponse from(TeacherTimeOff timeOff) {
        return new TeacherTimeOffResponse(
            timeOff.getId(),
            timeOff.getStartDateTime(),
            timeOff.getEndDateTime(),
            timeOff.getType(),
            timeOff.getReason()
        );
    }
}
