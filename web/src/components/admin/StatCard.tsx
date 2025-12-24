import { getScheduleStatusName } from "@/libs/schedule";
import { getUserRoleName } from "@/libs/user";
import { ScheduleStatus, ScheduleStatusSchema } from "@/schemas/schedule/schedule-status";
import { UserRole, UserRoleSchema } from "@/schemas/user/user-role";

interface StatCardProps {
  title: UserRole | ScheduleStatus;
  value: number;
  unit: string;
}

export function StatCard({ title, value, unit }: StatCardProps) {
  const displayTitle = (title: UserRole | ScheduleStatus) => {
    if (UserRoleSchema.safeParse(title).success) {
      return getUserRoleName(title as UserRole);
    }
    else if (ScheduleStatusSchema.safeParse(title).success) {
      return getScheduleStatusName(title as ScheduleStatus);
    }
    return title;
  };

  return (
    <div className="border p-4 w-full rounded-xl">
      <p>{displayTitle(title)}</p>
      <p>
        <span className="font-bold text-blue-500">{value}</span>{unit}
      </p>
    </div>
  );
}