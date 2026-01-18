import { getScheduleStatusName } from "@/lib/schedule";
import { getUserRoleName } from "@/lib/user";
import {
  ScheduleStatus,
  ScheduleStatusSchema,
} from "@/schema/schedule/schedule-status";
import { UserRole, UserRoleSchema } from "@/schema/user/user-role";

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
    <div className="w-full rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{displayTitle(title)}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {value}
        <span className="ml-1 text-base font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  );
}
