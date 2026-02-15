import { Schedule } from "@/schemas/schedule/schedule";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

// UI 표시 이름을 중앙에서 관리합니다.
const SCHEDULE_STATUS_NAMES: Record<string, string> = {
  SCHEDULED: "예정",
  ATTENDED: "출석",
  ABSENT: "결석",
  CANCELLED: "취소",
};

// 상태에 따른 색상 스타일을 매핑하여 관리합니다.
const SCHEDULE_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-muted text-muted-foreground",
  ATTENDED: "bg-primary/10 text-primary",
  ABSENT: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

interface ScheduleListTableProps {
  schedules: Schedule[];
  onUpdate: (scheduleId: number) => void;
}

export default function ScheduleListTable({
  schedules,
  onUpdate,
}: ScheduleListTableProps) {
  return (
    <table className="w-full min-w-[32rem] divide-y divide-border table-auto">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            사용자 ID
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            시작
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            종료
          </th>
          <th
            scope="col"
            className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sm:px-6 sm:py-4 sm:text-sm"
          >
            상태
          </th>
          <th scope="col" className="relative px-3 py-3 sm:px-6 sm:py-4">
            <span className="sr-only">수정</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-foreground text-left sm:px-6 sm:py-4">
              {schedule.userId}
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
              {format(new Date(schedule.startsAt), "yyyy-MM-dd HH:mm")}
            </td>
            <td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:px-6 sm:py-4 sm:text-sm">
              {format(new Date(schedule.endsAt), "yyyy-MM-dd HH:mm")}
            </td>
            <td className="px-3 py-3 whitespace-nowrap text-sm text-muted-foreground text-left sm:px-6 sm:py-4">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  SCHEDULE_STATUS_COLORS[schedule.status]
                )}
              >
                {SCHEDULE_STATUS_NAMES[schedule.status]}
              </Badge>
            </td>
            <td className="px-3 py-3 whitespace-nowrap text-right sm:px-6 sm:py-4">
              <Button
                onClick={() => onUpdate(schedule.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 shrink-0 p-0 sm:inline-flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                aria-label={`스케줄 ${schedule.id} 수정`}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">수정</span>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
