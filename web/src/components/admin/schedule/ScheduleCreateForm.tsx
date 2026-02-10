"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ScheduleCreateRequest,
  ScheduleCreateFormValues,
} from "@/schema/schedule/schedule";
import { ScheduleCreateRequestSchema } from "@/schema/schedule/schedule";
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
interface ScheduleCreateFormProps {
  onSubmit: (data: ScheduleCreateRequest) => void;
}

export default function ScheduleCreateForm({
  onSubmit,
}: ScheduleCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleCreateFormValues>({
    resolver: zodResolver(ScheduleCreateRequestSchema),
    defaultValues: {
      userId: "",
      startsAt: "",
      endsAt: "",
      status: "SCHEDULED",
    },
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <InputField
        id="userId"
        label="사용자 ID"
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

      <Button
        type="submit"
        className={cn(
          "mt-4 w-full rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
        )}
        disabled={isSubmitting}
      >
        등록
      </Button>
    </form>
  );
}
