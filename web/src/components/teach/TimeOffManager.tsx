"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TeacherTimeOffRequest,
  TEACHER_TIME_OFF_TYPE_LABELS,
  TeacherTimeOffType,
} from "@/schemas/teacher/time-off";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useTeacherTimeOffList,
  useCreateTeacherTimeOff,
  useDeleteTeacherTimeOff,
} from "@/hooks/teach/useTeacherTimeOff";
import Loader from "@/components/common/Loader";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

// 폼 전용: allDay일 때는 date 하나만 사용, 아니면 start/end datetime
const TimeOffFormSchema = z
  .object({
    allDay: z.boolean(),
    date: z.string().optional(),
    startDateTime: z.date().optional(),
    endDateTime: z.date().optional(),
    type: z.enum(["VACATION", "SICK_LEAVE", "PUBLIC_HOLIDAY"]),
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.allDay) {
      if (!data.date?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["date"],
          message: "날짜를 선택하세요.",
        });
      }
    } else {
      if (!data.startDateTime) {
        ctx.addIssue({
          code: "custom",
          path: ["startDateTime"],
          message: "시작 일시를 선택하세요.",
        });
      }
      if (!data.endDateTime) {
        ctx.addIssue({
          code: "custom",
          path: ["endDateTime"],
          message: "종료 일시를 선택하세요.",
        });
      }
      if (data.startDateTime && data.endDateTime && data.startDateTime >= data.endDateTime) {
        ctx.addIssue({
          code: "custom",
          path: ["endDateTime"],
          message: "종료 일시는 시작 일시보다 이후여야 합니다.",
        });
      }
    }
  });

type TimeOffFormValues = z.infer<typeof TimeOffFormSchema>;

function toDatetimeLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export default function TimeOffManager() {
  const { data: list, isLoading } = useTeacherTimeOffList();
  const createMutation = useCreateTeacherTimeOff();
  const deleteMutation = useDeleteTeacherTimeOff();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TimeOffFormValues>({
    resolver: zodResolver(TimeOffFormSchema),
    defaultValues: {
      allDay: false,
      date: "",
      startDateTime: undefined,
      endDateTime: undefined,
      type: "VACATION",
      reason: "",
    },
  });

  const allDay = watch("allDay");

  useEffect(() => {
    if (allDay) {
      setValue("startDateTime", undefined);
      setValue("endDateTime", undefined);
    } else {
      setValue("date", undefined);
    }
  }, [allDay, setValue]);

  const buildRequest = (values: TimeOffFormValues): TeacherTimeOffRequest => {
    if (values.allDay && values.date) {
      const start = new Date(values.date + "T00:00:00");
      const end = new Date(values.date + "T23:59:59");
      return {
        startDateTime: start,
        endDateTime: end,
        type: values.type as TeacherTimeOffType,
        reason: values.reason ?? undefined,
      };
    }
    return {
      startDateTime: values.startDateTime!,
      endDateTime: values.endDateTime!,
      type: values.type as TeacherTimeOffType,
      reason: values.reason ?? undefined,
    };
  };

  const onSubmit = (values: TimeOffFormValues) => {
    createMutation.mutate(buildRequest(values));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>휴무 관리</CardTitle>
          <CardDescription>휴무 일정을 등록하고 관리하세요.</CardDescription>
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
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>휴무 등록</CardTitle>
          <CardDescription>
            날짜·시간과 휴무 유형, 사유를 입력하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2">
              <Controller
                name="allDay"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                )}
              />
              <Label htmlFor="allDay" className="text-sm font-medium cursor-pointer">
                하루 종일
              </Label>
            </div>

            {allDay ? (
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm text-muted-foreground">
                  날짜
                </Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="date"
                      type="date"
                      {...field}
                      value={field.value ?? ""}
                      className={cn(errors.date && "border-destructive")}
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-xs text-destructive">{errors.date.message}</p>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    시작 일시
                  </Label>
                  <Controller
                    name="startDateTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        value={field.value ? toDatetimeLocal(field.value) : ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : undefined
                          )
                        }
                        className={cn(
                          errors.startDateTime && "border-destructive"
                        )}
                      />
                    )}
                  />
                  {errors.startDateTime && (
                    <p className="text-xs text-destructive">
                      {errors.startDateTime.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    종료 일시
                  </Label>
                  <Controller
                    name="endDateTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        value={field.value ? toDatetimeLocal(field.value) : ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : undefined
                          )
                        }
                        className={cn(
                          errors.endDateTime && "border-destructive"
                        )}
                      />
                    )}
                  />
                  {errors.endDateTime && (
                    <p className="text-xs text-destructive">
                      {errors.endDateTime.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">휴무 유형</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                  >
                    {(Object.keys(TEACHER_TIME_OFF_TYPE_LABELS) as TeacherTimeOffType[]).map(
                      (key) => (
                        <option key={key} value={key}>
                          {TEACHER_TIME_OFF_TYPE_LABELS[key]}
                        </option>
                      )
                    )}
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">사유 (선택)</Label>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value ?? ""}
                    rows={3}
                    placeholder="사유를 입력하세요."
                    className={cn(
                      "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="min-w-[5.5rem]"
            >
              {createMutation.isPending ? (
                <>
                  <Loader variant="inline" />
                  등록 중...
                </>
              ) : (
                "휴무 등록"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>휴무 목록</CardTitle>
          <CardDescription>등록된 휴무 일정 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {list && list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              등록된 휴무가 없습니다.
            </p>
          ) : (
            <ul className="space-y-3">
              {list?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {format(parseISO(item.startDateTime), "yyyy.MM.dd HH:mm", {
                        locale: ko,
                      })}
                      {" – "}
                      {format(parseISO(item.endDateTime), "yyyy.MM.dd HH:mm", {
                        locale: ko,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {TEACHER_TIME_OFF_TYPE_LABELS[item.type]}
                      {item.reason ? ` · ${item.reason}` : ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={
                      deleteMutation.isPending &&
                      deleteMutation.variables === item.id
                    }
                    aria-label="삭제"
                  >
                    <TrashIcon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
