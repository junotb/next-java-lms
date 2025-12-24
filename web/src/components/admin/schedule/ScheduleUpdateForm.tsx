"use client";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Schedule } from "@/schemas/schedule/schedule";
import type { ScheduleUpdateRequest, ScheduleUpdateFormValues } from "@/schemas/schedule/schedule";

interface ScheduleUpdateFormProps {
  schedule: Schedule;
  onSubmit: (data: ScheduleUpdateRequest) => void;
  onDelete: () => void;
}

export default function ScheduleUpdateForm({ schedule, onSubmit, onDelete }: ScheduleUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
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
      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="userId"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              사용자 번호
            </label>
            <input
              id="userId"
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              disabled={true}
              defaultValue={schedule.userId}
            />
          </div>
        </div>

        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="status"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              상태
            </label>
            <select
              id="status"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("status", {
                required: "상태를 입력해주세요."
              })}
            >
              <option value="SCHEDULED">예정됨</option>
              <option value="ATTENDED">출석</option>
              <option value="ABSENT">결석</option>
              <option value="CANCELLED">취소됨</option>
            </select>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="startsAt"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              시작 시간
            </label>
            <input
              id="startsAt"
              type="datetime-local"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              {...register("startsAt", {
                required: "시작 시간을 입력해주세요.",
                valueAsDate: true,
              })}
            />
          </div>
        </div>

        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="endsAt"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              종료 시간
            </label>
            <input
              id="endsAt"
              type="datetime-local"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              {...register("endsAt", {
                required: "종료 시간을 입력해주세요.",
                valueAsDate: true,
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 w-full">
        <button
          type="submit"
          className="mt-4 px-8 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
          disabled={isSubmitting}
        >
          수정
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="mt-4 px-8 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </form>
  );
}