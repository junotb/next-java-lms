"use client";

import StatsList from "@/component/admin/StatsList";
import StatsListSkeleton from "@/component/admin/StatsListSkeleton";
import { useScheduleStatusStats } from "@/hook/admin/useSchedule";
import { useUserRoleStats } from "@/hook/admin/useUser";
import { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { UserRole } from "@/schema/user/user-role";

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
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">관리자 대시보드</h1>
        <div className="flex flex-col gap-6">
          <StatsListSkeleton />
          <StatsListSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">관리자 대시보드</h1>
        <div className="rounded-lg border border-muted-foreground/30 bg-muted/30 p-6">
          <p className="text-foreground font-medium mb-2">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            잠시 후 다시 시도해주세요.
          </p>
          <div className="flex gap-2">
            {isScheduleStatusError && (
              <button
                type="button"
                onClick={() => refetchScheduleStatus()}
                className="rounded-md bg-foreground px-4 py-2 text-background hover:bg-foreground/90 text-sm"
              >
                스케줄 통계 다시 시도
              </button>
            )}
            {isUserRoleError && (
              <button
                type="button"
                onClick={() => refetchUserRole()}
                className="rounded-md bg-foreground px-4 py-2 text-background hover:bg-foreground/90 text-sm"
              >
                사용자 통계 다시 시도
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">관리자 대시보드</h1>

      <div className="flex flex-col gap-6">
        {/* 사용자 통계 */}
        {userRoleStats ? (
          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">사용자 통계</h2>
            <StatsList<UserRole> stats={userRoleStats} unit="명" />
          </section>
        ) : (
          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">사용자 통계</h2>
            <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
          </section>
        )}

        {/* 스케줄 통계 */}
        {scheduleStatusStats ? (
          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">스케줄 통계</h2>
            <StatsList<ScheduleStatus> stats={scheduleStatusStats} unit="건" />
          </section>
        ) : (
          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">스케줄 통계</h2>
            <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
          </section>
        )}
      </div>
    </div>
  );
}
