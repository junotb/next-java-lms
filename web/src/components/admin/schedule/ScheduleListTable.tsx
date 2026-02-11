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
    <table className="min-w-full divide-y divide-border">
      <thead className="bg-muted">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            사용자 번호
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            시작 시간
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            종료 시간
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wider"
          >
            상태
          </th>
          <th scope="col" className="relative px-6 py-4">
            <span className="sr-only">수정</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-card divide-y divide-border">
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-left">
              {schedule.userId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              {format(new Date(schedule.startsAt), "yyyy-MM-dd HH:mm")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              {format(new Date(schedule.endsAt), "yyyy-MM-dd HH:mm")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-left">
              <Badge
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5",
                  SCHEDULE_STATUS_COLORS[schedule.status]
                )}
              >
                {SCHEDULE_STATUS_NAMES[schedule.status]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
              <Button
                onClick={() => onUpdate(schedule.id)}
                className="px-2 lg:px-4 py-2 text-sm"
              >
                <Pencil className="mr-2 h-4 w-4" />
                수정
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
