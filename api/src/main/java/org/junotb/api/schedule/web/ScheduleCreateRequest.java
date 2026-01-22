package org.junotb.api.schedule.web;

import org.junotb.api.schedule.ScheduleStatus;

import java.time.OffsetDateTime;

public record ScheduleCreateRequest(
    Long courseId,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    ScheduleStatus status
) {}
