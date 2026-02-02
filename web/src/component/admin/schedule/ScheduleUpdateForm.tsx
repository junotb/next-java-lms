"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import type {
  Schedule,
  ScheduleUpdateRequest,
  ScheduleUpdateFormValues,
} from "@/schema/schedule/schedule";
import InputField from "@/component/common/InputField";
import SelectField from "@/component/common/SelectField";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";

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
    defaultValues: {
      startsAt: format(schedule.startsAt, "yyyy-MM-dd'T'HH:mm"),
      endsAt: format(schedule.endsAt, "yyyy-MM-dd'T'HH:mm"),
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
        validation={{ required: "상태를 선택하세요." }}
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
        validation={{
          required: "시작 시간을 입력하세요.",
          valueAsDate: true,
        }}
      />

      <InputField
        id="endsAt"
        label="종료 시간"
        type="datetime-local"
        register={register}
        errors={errors}
        validation={{
          required: "종료 시간을 입력하세요.",
          valueAsDate: true,
        }}
      />

      <div className="flex justify-center gap-4 w-full">
        <Button
          type="submit"
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none",
            "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white"
          )}
          disabled={isSubmitting}
        >
          수정
        </Button>

        <Button
          type="button"
          onClick={onDelete}
          className={cn(
            "mt-4 flex-1 rounded-xl px-8 py-3 font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5",
            "bg-red-600 hover:bg-red-700 text-white"
          )}
        >
          삭제
        </Button>
      </div>
    </form>
  );
}
