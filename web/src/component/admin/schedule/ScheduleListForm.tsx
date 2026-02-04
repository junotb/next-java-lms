import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ScheduleListRequest,
  ScheduleListFormValues,
} from "@/schema/schedule/schedule";
import { ScheduleListRequestSchema } from "@/schema/schedule/schedule";
import { ScheduleStatusSchema } from "@/schema/schedule/schedule-status";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import { Button } from "@/component/ui/button";
import { cn } from "@/lib/utils";
import { Search, RotateCcw } from "lucide-react";

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
    resolver: zodResolver(ScheduleListRequestSchema),
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
        <Label htmlFor="userId" className="text-sm font-medium text-foreground">
          사용자 번호
        </Label>
        <Input
          id="userId"
          type="text"
          className="px-2 lg:px-4 py-2 w-20 lg:w-32 text-sm h-auto"
          {...register("userId")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status" className="text-sm font-medium text-foreground">
          상태
        </Label>
        <select
          id="status"
          className={cn(
            "flex h-10 w-20 lg:w-24 rounded-md border border-input bg-background px-2 lg:px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
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
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="px-2 lg:px-4 py-2 text-sm h-auto"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          초기화
        </Button>

        <Button
          type="submit"
          className="px-2 lg:px-4 py-2 text-sm h-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          검색
        </Button>
      </div>
    </form>
  );
}
