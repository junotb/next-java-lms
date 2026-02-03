package org.junotb.api.user.web;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.junotb.api.user.TeacherAvailability;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record TeacherAvailabilityResponse(
    Long id,
    DayOfWeek dayOfWeek,
    @JsonFormat(pattern = "HH:mm")
    LocalTime startTime,
    @JsonFormat(pattern = "HH:mm")
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
