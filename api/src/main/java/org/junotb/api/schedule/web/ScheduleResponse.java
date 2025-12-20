package org.junotb.api.schedule.web;

import org.junotb.api.schedule.enums.ScheduleStatus;

import java.time.OffsetDateTime;

public record ScheduleResponse(
    Long id,
    Long userId,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    ScheduleStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static ScheduleResponse from(org.junotb.api.schedule.Schedule schedule) {
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
