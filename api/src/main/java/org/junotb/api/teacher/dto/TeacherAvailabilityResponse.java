package org.junotb.api.teacher.dto;

import org.junotb.api.user.TeacherAvailability;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record TeacherAvailabilityResponse(
    Long id,
    DayOfWeek dayOfWeek,
    LocalTime startTime,
    LocalTime endTime
) {
    public static TeacherAvailabilityResponse from(TeacherAvailability availability) {
        return new TeacherAvailabilityResponse(
            availability.getId(),
            availability.getDayOfWeek(),
            availability.getStartTime(),
            availability.getEndTime()
        );
    }
}
