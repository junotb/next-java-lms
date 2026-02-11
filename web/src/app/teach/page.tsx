"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarRange, ListTodo } from "lucide-react";
import { getTeachDashboard } from "@/lib/dashboard";
import DashboardNextClassCard from "@/components/dashboard/DashboardNextClassCard";
import DashboardStats, { type DashboardStatItem } from "@/components/dashboard/DashboardStats";
import DashboardScheduleList from "@/components/dashboard/DashboardScheduleList";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function TeachDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["teach", "dashboard"],
    queryFn: getTeachDashboard,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">관리 모드</h1>
        <DashboardSkeleton variant="teach" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">관리 모드</h1>
        <p className="text-muted-foreground mb-4">
          {isError ? "데이터를 불러오는 중 오류가 발생했습니다." : "데이터를 불러올 수 없습니다."}
        </p>
        {isError && (
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  const statItems: DashboardStatItem[] = [
    { label: "오늘 수업", value: data.stats.todayClassCount, icon: CalendarDays },
    { label: "예정된 수업", value: data.stats.upcomingClassCount, icon: CalendarRange },
    { label: "오늘 일정", value: data.todaySchedules.length, icon: ListTodo },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">관리 모드</h1>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">오늘 현황</h2>
          <DashboardStats items={statItems} variant="teach" />
        </section>
        <DashboardNextClassCard
          schedule={data.nextClass}
          role="TEACHER"
          variant="teach"
        />
        <DashboardScheduleList
          title="오늘 전체 일정"
          schedules={data.todaySchedules}
          role="TEACHER"
          variant="teach"
          emptyMessage="오늘 예정된 수업이 없습니다."
        />
        <DashboardScheduleList
          title="최근 완료 수업"
          schedules={data.recentCompletedSchedules ?? []}
          role="TEACHER"
          variant="teach"
          emptyMessage="최근 완료한 수업이 없습니다."
        />
      </div>
    </div>
  );
}
