package org.junotb.api.schedule.web;

import org.junotb.api.schedule.ScheduleStatus;

public record ScheduleListRequest(
    String userId,
    Long courseId,
    ScheduleStatus status
) {
    public static ScheduleListRequest empty() {
        return new ScheduleListRequest(
            null,
            null,
            null
        );
    }
}
