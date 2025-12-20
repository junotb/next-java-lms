"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScheduleUpdateRequest } from "@/schemas/schedule";
import { Schedule } from "@/schemas/schedule";

interface ScheduleUpdateFormProps {
  schedule: Schedule;
  onSubmit: (data: ScheduleUpdateRequest) => void;
  onDelete: () => void;
}

export default function ScheduleUpdateForm({ schedule, onSubmit, onDelete }: ScheduleUpdateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ScheduleUpdateRequest>({
    resolver: zodResolver(ScheduleUpdateRequest),
    defaultValues: { ...schedule },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <div className="flex space-x-4">
        <div className="flex flex-col items-end w-full">
          <div className="flex items-center gap-4 w-full">
            <label
              htmlFor="userId"
              className="w-16 text-left text-sm font-medium text-gray-700"
            >
              사용자 고유번호
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
            <input
              id="status"
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 text-sm rounded-md"
              {...register("status")}
            />
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
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              {...register("startsAt")}
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
              type="text"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              {...register("endsAt")}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          type="submit"
          className="mt-4 mx-auto px-8 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
          disabled={!isDirty || isSubmitting}
        >
          수정
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="mt-4 mx-auto px-8 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          삭제
        </button>
      </div>
    </form>
  );
}