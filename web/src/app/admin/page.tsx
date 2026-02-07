"use client";

import StatsList from "@/component/admin/StatsList";
import StatsListSkeleton from "@/component/admin/StatsListSkeleton";
import { useScheduleStatusStats } from "@/hook/admin/useSchedule";
import { useUserRoleStats } from "@/hook/admin/useUser";
import { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { UserRole } from "@/schema/user/user-role";

export default function AdminPage() {
  const { data: scheduleStatusStats, isLoading: isScheduleStatusLoading } =
    useScheduleStatusStats();
  const { data: userRoleStats, isLoading: isUserRoleLoading } =
    useUserRoleStats();

  return (
    // 전체 컨테이너: 랜딩 페이지와 일관된 너비(max-w-7xl)와 전문적인 대시보드 패딩을 적용합니다.
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-12">
        {/* 페이지 헤더: 좌측 정렬로 변경하여 대시보드 디자인의 가독성과 전문성을 높입니다. */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            대시보드
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            서비스의 주요 현황을 한눈에 확인하세요.
          </p>
        </header>

        {/* 통계 섹션: 그리드 레이아웃을 사용하여 넓은 화면에서 공간을 효율적으로 활용합니다. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* 사용자 통계 */}
          {isUserRoleLoading ? (
            <StatsListSkeleton />
          ) : (
            userRoleStats && (
              <StatsList<UserRole>
                title="사용자 통계"
                stats={userRoleStats}
                unit="명"
              />
            )
          )}

          {/* 스케줄 통계 */}
          {isScheduleStatusLoading ? (
            <StatsListSkeleton />
          ) : (
            scheduleStatusStats && (
              <StatsList<ScheduleStatus>
                title="스케줄 통계"
                stats={scheduleStatusStats}
                unit="건"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
