package org.junotb.api.schedule.web;

import org.junotb.api.schedule.ScheduleStatus;

public record ScheduleListRequest(
    Long userId,
    ScheduleStatus status
) {}
