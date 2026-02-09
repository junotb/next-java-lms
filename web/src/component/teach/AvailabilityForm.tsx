"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TeacherAvailabilityFormValues,
  TeacherAvailabilitySchema,
} from "@/schema/teacher/teacher-availability";
import {
  ALL_DAYS_OF_WEEK,
  getDayOfWeekName,
} from "@/schema/common/day-of-week";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/component/ui/card";
import { Label } from "@/component/ui/label";
import { Switch } from "@/component/ui/switch";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { useTeacherAvailability, useUpdateAvailability } from "@/hook/teach/useTeacherAvailability";
import { Loader2 } from "lucide-react";
import Loader from "@/component/common/Loader";

interface AvailabilityFormProps {
  onSubmit?: (data: TeacherAvailabilityFormValues) => void;
}

// 30분 단위 시간 옵션 생성 (06:00 ~ 23:00)
const generateTimeOptions = () => {
  const options: string[] = [];
  for (let hour = 6; hour <= 23; hour++) {
    options.push(`${String(hour).padStart(2, "0")}:00`);
    if (hour < 23) {
      options.push(`${String(hour).padStart(2, "0")}:30`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export default function AvailabilityForm({ onSubmit }: AvailabilityFormProps) {
  const { data, isLoading } = useTeacherAvailability();
  const updateMutation = useUpdateAvailability();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TeacherAvailabilityFormValues>({
    resolver: zodResolver(TeacherAvailabilitySchema),
    defaultValues: {
      availabilities: ALL_DAYS_OF_WEEK.map((day) => ({
        dayOfWeek: day,
        enabled: false,
        startTime: "09:00",
        endTime: "18:00",
      })),
    },
  });

  // 서버에서 데이터를 가져오면 폼 초기화
  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const watchedAvailabilities = watch("availabilities");

  const handleFormSubmit = (formData: TeacherAvailabilityFormValues) => {
    if (onSubmit) {
      onSubmit(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>가용 시간 설정</CardTitle>
          <CardDescription>
            각 요일별로 수업 가능한 시간을 설정하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>가용 시간 설정</CardTitle>
        <CardDescription>
          각 요일별로 수업 가능한 시간을 설정하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {ALL_DAYS_OF_WEEK.map((day, index) => {
            const enabled = watchedAvailabilities[index]?.enabled ?? false;
            const dayError = errors.availabilities?.[index];

            return (
              <div
                key={day}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border",
                  !enabled && "opacity-50"
                )}
              >
                {/* 요일 라벨 */}
                <div className="w-20 flex-shrink-0">
                  <Label className="text-sm font-medium">
                    {getDayOfWeekName(day)}
                  </Label>
                </div>

                {/* Switch */}
                <div className="flex-shrink-0">
                  <Controller
                    name={`availabilities.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                </div>

                {/* 시작 시간 */}
                <div className="flex-1">
                  <Controller
                    name={`availabilities.${index}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label
                          htmlFor={`start-${day}`}
                          className="text-xs text-muted-foreground"
                        >
                          시작 시간
                        </Label>
                        <select
                          id={`start-${day}`}
                          {...field}
                          disabled={!enabled}
                          className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            dayError?.startTime &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        {dayError?.startTime && (
                          <p className="text-xs text-destructive">
                            {dayError.startTime.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* 종료 시간 */}
                <div className="flex-1">
                  <Controller
                    name={`availabilities.${index}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <Label
                          htmlFor={`end-${day}`}
                          className="text-xs text-muted-foreground"
                        >
                          종료 시간
                        </Label>
                        <select
                          id={`end-${day}`}
                          {...field}
                          disabled={!enabled}
                          className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            dayError?.endTime &&
                              "border-destructive focus-visible:ring-destructive"
                          )}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        {dayError?.endTime && (
                          <p className="text-xs text-destructive">
                            {dayError.endTime.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="min-w-[5.5rem]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
