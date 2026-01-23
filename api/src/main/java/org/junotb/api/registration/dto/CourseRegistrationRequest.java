package org.junotb.api.registration.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record CourseRegistrationRequest(
    @NotNull(message = "강좌 ID는 필수입니다.")
    Long courseId,
    
    @NotNull(message = "수강 기간은 필수입니다.")
    @Min(value = 1, message = "수강 기간은 최소 1개월 이상이어야 합니다.")
    Integer months,
    
    @NotEmpty(message = "희망 요일은 최소 1개 이상 선택해야 합니다.")
    List<DayOfWeek> days,
    
    @NotNull(message = "희망 시작 시간은 필수입니다.")
    LocalTime startTime,
    
    @NotNull(message = "수업 시간은 필수입니다.")
    @Positive(message = "수업 시간은 양수여야 합니다.")
    Integer durationMinutes
) {
}
