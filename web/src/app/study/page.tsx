"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BookOpen, Award, ClipboardList, PlusCircle } from "lucide-react";
import { getStudyDashboard } from "@/lib/dashboard";
import DashboardNextClassCard from "@/component/dashboard/DashboardNextClassCard";
import DashboardStats, { type DashboardStatItem } from "@/component/dashboard/DashboardStats";
import DashboardScheduleList from "@/component/dashboard/DashboardScheduleList";
import DashboardSkeleton from "@/component/dashboard/DashboardSkeleton";
import { Button } from "@/component/ui/button";

export default function StudyDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["study", "dashboard"],
    queryFn: getStudyDashboard,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">내 공부방</h1>
        <DashboardSkeleton variant="study" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const statItems: DashboardStatItem[] = [
    { label: "수강 중", value: data.stats.activeCourseCount, icon: BookOpen },
    { label: "수업 완료 횟수", value: data.stats.completedClassCount, icon: Award },
    { label: "최근 수업", value: data.recentSchedules.length, icon: ClipboardList },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">내 공부방</h1>
        <Button asChild className="bg-foreground hover:bg-foreground/90 text-background">
          <Link href="/study/registration" className="flex items-center gap-2">
            <PlusCircle className="size-4" />
            수업 신청하기
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <DashboardNextClassCard
          schedule={data.nextClass}
          role="STUDENT"
          variant="study"
        />
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">학습 현황</h2>
          <DashboardStats items={statItems} variant="study" />
        </section>
        <DashboardScheduleList
          title="최근 학습 이력"
          schedules={data.recentSchedules}
          role="STUDENT"
          variant="study"
          emptyMessage="최근 수업 이력이 없습니다."
        />
      </div>
    </div>
  );
}
