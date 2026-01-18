import { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { UserRole } from "@/schema/user/user-role";
import { StatCard } from "./StatCard";

type StatKey = UserRole | ScheduleStatus;

interface StatsListProps<K extends StatKey> {
  title: string;
  stats: Partial<Record<K, number>>;
  unit: string;
}

export default function StatsList<K extends StatKey>({
  title,
  stats,
  unit,
}: StatsListProps<K>) {
  const entries = Object.entries(stats ?? {}) as [K, number][];

  return (
    <section className="flex flex-col gap-4">
      {/* 페이지의 h1과 구분하기 위해 h2를 사용하고, 불필요한 스타일을 제거합니다. */}
      <h2 className="text-2xl font-bold">{title}</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {entries.map(([key, value]) => (
          <StatCard key={key} title={key} value={value} unit={unit} />
        ))}
      </div>
    </section>
  );
}
