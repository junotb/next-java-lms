package org.junotb.api.schedule.web;

import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleStatus;

import java.time.OffsetDateTime;

public record ScheduleResponse(
    Long id,
    String userId,
    Long courseId,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    ScheduleStatus status,
    String meetLink,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static ScheduleResponse from(Schedule schedule) {
        return new ScheduleResponse(
            schedule.getId(),
            schedule.getUser().getId(),
            schedule.getCourse() != null ? schedule.getCourse().getId() : null,
            schedule.getStartsAt(),
            schedule.getEndsAt(),
            schedule.getStatus(),
            schedule.getMeetLink(),
            schedule.getCreatedAt(),
            schedule.getUpdatedAt()
        );
    }
}
