"use client";

import StatsList from "@/components/admin/StatsList";
import StatsListSkeleton from "@/components/admin/StatsListSkeleton";
import { useScheduleStatusStats } from "@/hooks/admin/useSchedule";
import { useUserRoleStats } from "@/hooks/admin/useUser";
import { ScheduleStatus } from "@/schemas/schedule/schedule-status";
import { UserRole } from "@/schemas/user/user-role";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const {
    data: scheduleStatusStats,
    isLoading: isScheduleStatusLoading,
    isError: isScheduleStatusError,
    refetch: refetchScheduleStatus,
  } = useScheduleStatusStats();
  const {
    data: userRoleStats,
    isLoading: isUserRoleLoading,
    isError: isUserRoleError,
    refetch: refetchUserRole,
  } = useUserRoleStats();

  const isLoading = isScheduleStatusLoading || isUserRoleLoading;
  const isError = isScheduleStatusError || isUserRoleError;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">관리자 대시보드</h1>
        <div className="flex flex-col gap-6">
          <StatsListSkeleton />
          <StatsListSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">관리자 대시보드</h1>
        <div className="rounded-lg border border-muted-foreground/30 bg-muted/30 p-4 sm:p-6">
          <p className="mb-2 font-medium text-foreground">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            잠시 후 다시 시도해주세요.
          </p>
          <div className="flex flex-wrap gap-2">
            {isScheduleStatusError && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => refetchScheduleStatus()}
              >
                스케줄 통계 다시 시도
              </Button>
            )}
            {isUserRoleError && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => refetchUserRole()}
              >
                사용자 통계 다시 시도
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">관리자 대시보드</h1>

      <div className="flex flex-col gap-6">
        {/* 사용자 통계 */}
        {userRoleStats ? (
          <section className="min-w-0">
            <h2 className="mb-3 text-base font-semibold text-foreground">사용자 통계</h2>
            <StatsList<UserRole> stats={userRoleStats} unit="명" />
          </section>
        ) : (
          <section className="min-w-0">
            <h2 className="mb-3 text-base font-semibold text-foreground">사용자 통계</h2>
            <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
          </section>
        )}

        {/* 스케줄 통계 */}
        {scheduleStatusStats ? (
          <section className="min-w-0">
            <h2 className="mb-3 text-base font-semibold text-foreground">스케줄 통계</h2>
            <StatsList<ScheduleStatus> stats={scheduleStatusStats} unit="건" />
          </section>
        ) : (
          <section className="min-w-0">
            <h2 className="mb-3 text-base font-semibold text-foreground">스케줄 통계</h2>
            <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
          </section>
        )}
      </div>
    </div>
  );
}
