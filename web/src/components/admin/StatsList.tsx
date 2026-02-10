import { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { UserRole } from "@/schema/user/user-role";
import { StatCard } from "./StatCard";

type StatKey = UserRole | ScheduleStatus;

interface StatsListProps<K extends StatKey> {
  stats: Partial<Record<K, number>>;
  unit: string;
}

export default function StatsList<K extends StatKey>({
  stats,
  unit,
}: StatsListProps<K>) {
  const entries = Object.entries(stats ?? {}) as [K, number][];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {entries.map(([key, value]) => (
        <StatCard key={key} title={key} value={value} unit={unit} />
      ))}
    </div>
  );
}
