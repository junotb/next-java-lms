import { ScheduleStatus } from "@/schema/schedule/schedule-status";
import { UserRole } from "@/schema/user/user-role";
import { StatCard } from "./StatCard";

type StatKey = UserRole | ScheduleStatus;

interface StatsListProps<K extends StatKey> {
  title: string;
  stats: Partial<Record<K, number>>;
  unit: string;
}

export default function StatsList<K extends StatKey>({ title, stats, unit }: StatsListProps<K>) {
  const entries = Object.entries(stats ?? {}) as [K, number][];

  return (
    <section className="flex flex-col gap-4 mx-auto w-sm lg:w-lg">
      <h1 className="text-2xl font-bold mb-4 col-span-full">{title}</h1>

      <div className="flex gap-4 justify-center">
        {entries.map(([key, value]) => (
          <StatCard key={key} title={key} value={value} unit={unit} />
        ))}
      </div>
    </section>
  );
}