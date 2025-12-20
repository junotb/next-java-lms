import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScheduleListRequest } from "@/schemas/schedule";

const DEFAULT_REQUEST: ScheduleListRequest = {
  userId: null,
  status: null,
};

interface ScheduleListFormProps {
  onSubmit: (data: ScheduleListRequest) => void;
}

export default function ScheduleListForm({ onSubmit }: ScheduleListFormProps) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ScheduleListRequest>({
    resolver: zodResolver(ScheduleListRequest),
    defaultValues: DEFAULT_REQUEST,
  });

  const handleReset = () => reset(DEFAULT_REQUEST);
  
  return (
    <form
      className="flex flex-wrap justify-center items-end gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="lastName"
          className="text-sm font-medium text-gray-700"
        >
          사용자 고유번호
        </label>
        <input
          id="lastName"
          type="text"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm rounded-md"
          {...register("userId")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="status"
          className="text-sm font-medium text-gray-700"
        >
          상태
        </label>
        <select
          id="status"
          className="border px-2 lg:px-4 py-2 w-20 lg:w-24 text-sm rounded-md"
          {...register("status")}
        >
          <option value="">전체</option>
          <option value="ACTIVE">활성</option>
          <option value="INACTIVE">비활성</option>
        </select>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button type="button" onClick={handleReset} className="border px-2 lg:px-4 py-2 text-sm rounded-md cursor-pointer">
          초기화
        </button>

        <button type="submit" className="border border-blue-600 bg-blue-600 text-white px-2 lg:px-4 py-2 text-sm rounded-md hover:bg-blue-700 cursor-pointer">
          검색
        </button>
      </div>
    </form>
  );
}