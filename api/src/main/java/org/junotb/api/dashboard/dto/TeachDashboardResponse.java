package org.junotb.api.dashboard.dto;

import java.util.List;

/**
 * 강사용 대시보드 응답.
 */
public record TeachDashboardResponse(
    DashboardNextClassResponse nextClass,
    TeachDashboardStats stats,
    List<ScheduleSummaryResponse> todaySchedules
) {
    public record TeachDashboardStats(
        long todayClassCount,
        long upcomingClassCount
    ) {}
}
