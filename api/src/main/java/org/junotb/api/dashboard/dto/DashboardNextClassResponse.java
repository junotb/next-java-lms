package org.junotb.api.dashboard.dto;

import java.time.OffsetDateTime;

/**
 * 대시보드용 "다음 수업" 정보.
 * - 학생이 볼 때: instructorName 설정, studentName null.
 * - 강사가 볼 때: studentName 설정, instructorName null.
 */
public record DashboardNextClassResponse(
    Long scheduleId,
    String courseTitle,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    String instructorName,
    String studentName
) {}
