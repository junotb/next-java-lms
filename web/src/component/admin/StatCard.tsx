import { getScheduleStatusName } from "@/lib/schedule";
import { getUserRoleName } from "@/lib/user";
import {
  ScheduleStatus,
  ScheduleStatusSchema,
} from "@/schema/schedule/schedule-status";
import { UserRole, UserRoleSchema } from "@/schema/user/user-role";
import { Card, CardContent } from "@/component/ui/card";

interface StatCardProps {
  title: UserRole | ScheduleStatus;
  value: number;
  unit: string;
}

export function StatCard({ title, value, unit }: StatCardProps) {
  const displayTitle = (title: UserRole | ScheduleStatus) => {
    if (UserRoleSchema.safeParse(title).success) {
      return getUserRoleName(title as UserRole);
    } else if (ScheduleStatusSchema.safeParse(title).success) {
      return getScheduleStatusName(title as ScheduleStatus);
    }
    return title;
  };

  return (
    <Card className="w-full rounded-xl">
      <CardContent className="p-4">
        <p className="text-sm font-medium text-muted-foreground">{displayTitle(title)}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {value}
          <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>
        </p>
      </CardContent>
    </Card>
  );
}
