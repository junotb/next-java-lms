package org.junotb.api.schedule.web;

import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleStatus;

import java.time.OffsetDateTime;

public record ScheduleResponse(
    Long id,
    String userId,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    ScheduleStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static ScheduleResponse from(Schedule schedule) {
        return new ScheduleResponse(
            schedule.getId(),
            schedule.getUserId(),
            schedule.getStartsAt(),
            schedule.getEndsAt(),
            schedule.getStatus(),
            schedule.getCreatedAt(),
            schedule.getUpdatedAt()
        );
    }
}
