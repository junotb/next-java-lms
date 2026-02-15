import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ScheduleListRequest,
  ScheduleListFormValues,
} from "@/schemas/schedule/schedule";
import { ScheduleListRequestSchema } from "@/schemas/schedule/schedule";
import { ScheduleStatusSchema } from "@/schemas/schedule/schedule-status";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  const handleFormSubmit = (data: ScheduleListFormValues) => {
    onSubmit({
      userId: data.userId,
      status: data.status === "" ? undefined : data.status,
    });
  };

  return (
    <form
      className="flex flex-wrap items-end gap-3 sm:gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="userId" className="shrink-0 text-sm font-medium text-foreground">
          사용자 ID
        </Label>
        <Input
          id="userId"
          type="text"
          className="min-w-[4.5rem] max-w-32 px-2 py-2 text-sm h-auto sm:w-28 lg:w-32 sm:px-4"
          {...register("userId")}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
        <Label htmlFor="status" className="shrink-0 text-sm font-medium text-foreground">
          상태
        </Label>
        <select
          id="status"
          className={cn(
            "flex h-10 min-w-[5rem] max-w-24 rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 lg:w-24"
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

      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 shrink-0 py-2 text-sm h-auto sm:flex-none sm:px-4"
        >
          <RotateCcw className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">초기화</span>
        </Button>

        <Button
          type="submit"
          className="flex-1 shrink-0 py-2 text-sm h-auto sm:flex-none sm:px-4"
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">검색</span>
        </Button>
      </div>
    </form>
  );
}
