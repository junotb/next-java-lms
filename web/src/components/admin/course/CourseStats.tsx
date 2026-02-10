"use client";

import { BookOpen, DoorOpen, Lock } from "lucide-react";
import { useCourseStatusStats } from "@/hook/admin/useCourse";
import { CourseStatus } from "@/schema/course/course-status";
import { COURSE_STATUS_LABELS } from "@/constants/course";
import { Card, CardContent } from "@/component/ui/card";
import Loader from "@/component/common/Loader";

export default function CourseStats() {
  const { data: stats, isLoading } = useCourseStatusStats();

  if (isLoading) {
    return <Loader />;
  }

  if (!stats) {
    return null;
  }

  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const activeCount = stats.ACTIVE || 0;
  const inactiveCount = stats.INACTIVE || 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 전체 강의 */}
      <Card className="w-full rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                전체 강의
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {total}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  개
                </span>
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* 활성 */}
      <Card className="w-full rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {COURSE_STATUS_LABELS[CourseStatus.ACTIVE]}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {activeCount}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  개
                </span>
              </p>
            </div>
            <DoorOpen className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* 비활성 */}
      <Card className="w-full rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {COURSE_STATUS_LABELS[CourseStatus.INACTIVE]}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {inactiveCount}
                <span className="ml-1 text-base font-normal text-muted-foreground">
                  개
                </span>
              </p>
            </div>
            <Lock className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
