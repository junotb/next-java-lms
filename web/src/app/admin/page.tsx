"use client";

import StatsList from "@/component/admin/StatsList";
import StatsListSkeleton from "@/component/admin/StatsListSkeleton";
import { useScheduleStatusStats } from "@/hook/admin/useSchedule";
import { useUserRoleStats } from "@/hook/admin/useUser";
import { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { UserRole } from "@/schema/user/user-role";

export default function AdminPage() {
  const { data: scheduleStatusStats, isLoading: isScheduleStatusLoading } = useScheduleStatusStats(null);
  const { data: userRoleStats, isLoading: isUserRoleLoading } = useUserRoleStats(null);

  console.log('scheduleStatusStats', scheduleStatusStats);

  return (
    <div className="mx-auto py-24 lg:py-32 w-md lg:w-xl bg-background">
      <div className="flex flex-col justify-center items-center max-w-5xl w-full space-y-8 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold">
          대시보드
        </h1>

        {isUserRoleLoading
          ? <StatsListSkeleton />
          : userRoleStats &&
            <StatsList<UserRole> title="사용자 통계" stats={userRoleStats} unit="명" />
        }
        {isScheduleStatusLoading
          ? <StatsListSkeleton />
          : scheduleStatusStats &&
            <StatsList<ScheduleStatus> title="스케줄 통계" stats={scheduleStatusStats} unit="건" />
        }
      </div>
    </div>
  );
}
