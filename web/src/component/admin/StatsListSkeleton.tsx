export default function StatsListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-4 flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-16 rounded bg-muted mb-2" />
            <div className="h-6 w-12 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
