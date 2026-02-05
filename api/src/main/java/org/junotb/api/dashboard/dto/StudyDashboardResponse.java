package org.junotb.api.dashboard.dto;

import java.util.List;

/**
 * 학생용 대시보드 응답.
 */
public record StudyDashboardResponse(
    DashboardNextClassResponse nextClass,
    StudyDashboardStats stats,
    List<ScheduleSummaryResponse> recentSchedules
) {
    public record StudyDashboardStats(
        long activeCourseCount,
        long completedClassCount
    ) {}
}
