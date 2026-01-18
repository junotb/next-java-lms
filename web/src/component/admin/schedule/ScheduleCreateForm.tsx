"use client";

import { useForm } from "react-hook-form";
import type {
  ScheduleCreateRequest,
  ScheduleCreateFormValues,
} from "@/schema/schedule/schedule";
import InputField from "@/component/common/InputField";
import SelectField from "@/component/common/SelectField";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";

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
        validation={{ required: "사용자 ID를 입력하세요." }}
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

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none disabled:transform-none"
        disabled={isSubmitting}
      >
        등록
      </button>
    </form>
  );
}
