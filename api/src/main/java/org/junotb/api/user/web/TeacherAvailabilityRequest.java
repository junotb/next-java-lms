package org.junotb.api.user.web;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record TeacherAvailabilityRequest(
    @NotNull(message = "요일을 선택하세요.")
    DayOfWeek dayOfWeek,
    
    @NotNull(message = "시작 시간을 입력하세요.")
    @JsonFormat(pattern = "HH:mm")
    LocalTime startTime,
    
    @NotNull(message = "종료 시간을 입력하세요.")
    @JsonFormat(pattern = "HH:mm")
    LocalTime endTime,
    
    @NotNull(message = "활성화 여부를 선택하세요.")
    Boolean enabled
) {
}
