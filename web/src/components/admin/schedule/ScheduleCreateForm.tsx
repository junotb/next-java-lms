"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScheduleCreateRequest } from "@/schemas/schedule";

interface ScheduleCreateFormProps {
  onSubmit: (data: ScheduleCreateRequest) => void;
}

export default function ScheduleCreateForm({ onSubmit }: ScheduleCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleCreateRequest>({
    resolver: zodResolver(ScheduleCreateRequest),
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
              type="number"
              className="border px-2 lg:px-4 py-2 w-28 lg:w-40 disabled:bg-gray-200 text-sm rounded-md"
              {...register("userId", { valueAsNumber: true })}
            />
          </div>
          {errors.userId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userId.message}
            </p>
          )}
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
              {...register("status")}
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="ATTENDED">ATTENDED</option>
              <option value="ABSENT">ABSENT</option>
              <option value="CANCELLED">CANCELLED</option>
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
              {...register("startsAt")}
            />
          </div>
          {errors.startsAt && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startsAt.message}
            </p>
          )}
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
              {...register("endsAt")}
            />
          </div>
          {errors.endsAt && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endsAt.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          type="submit"
          className="mt-4 mx-auto px-8 py-2 bg-blue-600 text-white rounded"
        >
          등록
        </button>
      </div>
    </form>
  );
}