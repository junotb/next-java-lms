import { useForm } from "react-hook-form";
import type {
  ScheduleListRequest,
  ScheduleListFormValues,
} from "@/schema/schedule/schedule";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";

// UI 표시 이름을 중앙에서 관리합니다.
const SCHEDULE_STATUS_NAMES: Record<string, string> = {
  SCHEDULED: "예정",
  ATTENDED: "출석",
  ABSENT: "결석",
  CANCELLED: "취소",
};

interface ScheduleListFormProps {
  onSubmit: (data: ScheduleListRequest) => void;
}

export default function ScheduleListForm({ onSubmit }: ScheduleListFormProps) {
  const { register, handleSubmit, reset } = useForm<ScheduleListFormValues>({
    defaultValues: {
      userId: undefined,
      status: undefined,
    },
    mode: "onSubmit",
  });

  const handleReset = () =>
    reset({
      userId: undefined,
      status: undefined,
    });

  return (
    <form
      className="flex flex-wrap justify-start items-end gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="userId" className="text-sm font-medium text-gray-700">
          사용자 번호
        </label>
        <input
          id="userId"
          type="text"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm rounded-md"
          {...register("userId")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-700">
          상태
        </label>
        <select
          id="status"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-24 text-sm rounded-md"
          {...register("status")}
        >
          <option value="">전체</option>
          {ScheduleStatusSchema.options.map((status) => (
            <option key={status} value={status}>
              {SCHEDULE_STATUS_NAMES[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          className="border px-2 lg:px-4 py-2 text-sm rounded-md cursor-pointer"
          onClick={handleReset}
        >
          초기화
        </button>

        <button
          type="submit"
          className="border border-blue-600 bg-blue-600 text-white px-2 lg:px-4 py-2 text-sm rounded-md hover:bg-blue-700 cursor-pointer"
        >
          검색
        </button>
      </div>
    </form>
  );
}
