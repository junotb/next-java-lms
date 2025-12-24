export default function StatsListSkeleton() {
  return (
    <section className="flex flex-col items-center gap-4 mx-auto w-sm lg:w-lg animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>

      <div className="flex gap-4 justify-center w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center border border-gray-100 p-4 w-full rounded-xl">
            <div className="h-4 w-12 bg-gray-100 rounded mb-3"></div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}