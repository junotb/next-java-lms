export default function StatsListSkeleton() {
  return (
    <section className="flex flex-col gap-4 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 w-48 rounded-md bg-muted" />

      {/* Cards Container Skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          // Card Skeleton
          <div
            key={i}
            className="w-full rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 h-4 w-16 rounded bg-muted" />
            <div className="h-8 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}
