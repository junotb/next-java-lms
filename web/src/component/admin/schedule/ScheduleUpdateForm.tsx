"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Schedule,
  ScheduleUpdateRequest,
  ScheduleUpdateFormValues,
} from "@/schema/schedule/schedule";
import { ScheduleUpdateRequestSchema } from "@/schema/schedule/schedule";
import InputField from "@/component/common/InputField";
import SelectField from "@/component/common/SelectField";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const SCHEDULE_STATUS_NAMES: Record<string, string> = {
  SCHEDULED: "예정",
  ATTENDED: "출석",
  ABSENT: "결석",
  CANCELLED: "취소",
};
interface ScheduleUpdateFormProps {
  schedule: Schedule;
  onSubmit: (data: ScheduleUpdateRequest) => void;
  onDelete: () => void;
}

export default function ScheduleUpdateForm({
  schedule,
  onSubmit,
  onDelete,
}: ScheduleUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleUpdateFormValues>({
    resolver: zodResolver(ScheduleUpdateRequestSchema),
    defaultValues: {
      userId: schedule.userId,
      startsAt: format(new Date(schedule.startsAt), "yyyy-MM-dd'T'HH:mm"),
      endsAt: format(new Date(schedule.endsAt), "yyyy-MM-dd'T'HH:mm"),
      status: schedule.status,
    },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // 시간 변환
        const payload: ScheduleUpdateRequest = {
          ...values,
          startsAt: new Date(values.startsAt).toISOString(),
          endsAt: new Date(values.endsAt).toISOString(),
        };

        onSubmit(payload);
      })}
      className="flex flex-col gap-4 w-full"
    >
      <InputField
        id="userId"
        label="사용자 번호"
        type="text"
        disabled={true}
        defaultValue={schedule.userId}
        register={register}
        errors={errors}
      />

      <SelectField
        id="status"
        label="상태"
        register={register}
        errors={errors}
      >
        {ScheduleStatusSchema.options.map((status) => (
          <option key={status} value={status}>
            {SCHEDULE_STATUS_NAMES[status]}
          </option>
        ))}
      </SelectField>

      <InputField
        id="startsAt"
        label="시작 시간"
        type="datetime-local"
        register={register}
        errors={errors}
      />

      <InputField
        id="endsAt"
        label="종료 시간"
        type="datetime-local"
        register={register}
        errors={errors}
      />

      <div className="flex justify-center gap-4 w-full">
        <Button
          type="submit"
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
          )}
          disabled={isSubmitting}
        >
          수정
        </Button>

        <Button
          type="button"
          onClick={onDelete}
          variant="destructive"
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-destructive/20 transition-all hover:-translate-y-0.5"
          )}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          삭제
        </Button>
      </div>
    </form>
  );
}
