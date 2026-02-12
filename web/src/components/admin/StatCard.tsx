import { getScheduleStatusName } from "@/lib/schedule";
import { getUserRoleName } from "@/lib/user";
import {
  ScheduleStatus,
  ScheduleStatusSchema,
} from "@/schemas/schedule/schedule-status";
import { UserRole, UserRoleSchema } from "@/schemas/user/user-role";
import { Users, UserCheck, GraduationCap, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: UserRole | ScheduleStatus;
  value: number;
  unit: string;
}

function getIcon(title: UserRole | ScheduleStatus): LucideIcon {
  if (UserRoleSchema.safeParse(title).success) {
    const role = title as UserRole;
    switch (role) {
      case "ADMIN":
        return UserCheck;
      case "TEACHER":
        return GraduationCap;
      case "STUDENT":
        return Users;
      default:
        return Users;
    }
  } else if (ScheduleStatusSchema.safeParse(title).success) {
    const status = title as ScheduleStatus;
    switch (status) {
      case "SCHEDULED":
        return Calendar;
      case "ATTENDED":
        return CheckCircle2;
      case "ABSENT":
        return AlertCircle;
      case "CANCELLED":
        return XCircle;
      default:
        return AlertCircle;
    }
  }
  return Users;
}

function getDisplayTitle(title: UserRole | ScheduleStatus): string {
  if (UserRoleSchema.safeParse(title).success) {
    return getUserRoleName(title as UserRole);
  } else if (ScheduleStatusSchema.safeParse(title).success) {
    return getScheduleStatusName(title as ScheduleStatus);
  }
  return String(title);
}

export function StatCard({ title, value, unit }: StatCardProps) {
  const Icon = getIcon(title);
  const displayTitle = getDisplayTitle(title);

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
      <div className="rounded-lg p-2.5 bg-muted text-foreground">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground truncate">
          {displayTitle}
        </p>
        <p className="text-xl font-semibold tabular-nums">
          {value}
          <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
        </p>
      </div>
    </div>
  );
}
