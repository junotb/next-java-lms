package org.junotb.api.schedule.dtos;

import org.junotb.api.schedule.Schedule;

public record ScheduleDto(Long id) {
    public static ScheduleDto from(Schedule schedule) {
        return new ScheduleDto(schedule.getId());
    }
}
