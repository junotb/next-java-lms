package org.junotb.api.dashboard.dto;

import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleStatus;

import java.time.OffsetDateTime;

/**
 * 대시보드 목록용 스케줄 요약 (수업명 포함).
 */
public record ScheduleSummaryResponse(
    Long id,
    String userId,
    Long courseId,
    String courseTitle,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    ScheduleStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    String instructorName,
    String studentName
) {
    public static ScheduleSummaryResponse from(Schedule schedule) {
        if (schedule == null) {
            throw new IllegalArgumentException("Schedule cannot be null");
        }
        
        // 필수 필드가 null인 경우 기본값 사용
        OffsetDateTime now = OffsetDateTime.now();
        return new ScheduleSummaryResponse(
            schedule.getId() != null ? schedule.getId() : 0L,
            schedule.getUser() != null ? schedule.getUser().getId() : null,
            schedule.getCourse() != null ? schedule.getCourse().getId() : null,
            schedule.getCourse() != null ? schedule.getCourse().getTitle() : null,
            schedule.getStartsAt() != null ? schedule.getStartsAt() : now,
            schedule.getEndsAt() != null ? schedule.getEndsAt() : now,
            schedule.getStatus() != null ? schedule.getStatus() : org.junotb.api.schedule.ScheduleStatus.SCHEDULED,
            schedule.getCreatedAt() != null ? schedule.getCreatedAt() : now,
            schedule.getUpdatedAt() != null ? schedule.getUpdatedAt() : now,
            schedule.getUser() != null ? schedule.getUser().getName() : null,
            null // studentName은 Service에서 별도로 설정
        );
    }
}
