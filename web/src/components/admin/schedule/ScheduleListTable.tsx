import { Schedule } from "@/schemas/schedule/schedule";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";

const SCHEDULE_STATUS_NAMES: Record<string, string> = {
  SCHEDULED: "예정",
  ATTENDED: "출석",
  ABSENT: "결석",
  CANCELED: "취소",
};

const SCHEDULE_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-muted text-muted-foreground",
  ATTENDED: "bg-primary/10 text-primary",
  ABSENT: "bg-destructive/10 text-destructive",
  CANCELED: "bg-muted text-muted-foreground",
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>강사 ID</TableHead>
          <TableHead>시작</TableHead>
          <TableHead>종료</TableHead>
          <TableHead>상태</TableHead>
          <TableHead className="relative">
            <span className="sr-only">수정</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell className="font-medium">{schedule.userId}</TableCell>
            <TableCell className="text-muted-foreground text-xs sm:text-sm">
              {format(new Date(schedule.startsAt), "yyyy-MM-dd HH:mm")}
            </TableCell>
            <TableCell className="text-muted-foreground text-xs sm:text-sm">
              {format(new Date(schedule.endsAt), "yyyy-MM-dd HH:mm")}
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold leading-5 sm:px-3 sm:py-1 sm:text-sm",
                  SCHEDULE_STATUS_COLORS[schedule.status]
                )}
              >
                {SCHEDULE_STATUS_NAMES[schedule.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                onClick={() => onUpdate(schedule.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 shrink-0 p-0 sm:inline-flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2"
                aria-label={`수업 ${schedule.id} 수정`}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">수정</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
