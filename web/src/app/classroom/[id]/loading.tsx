"use client";

import Loader from "@/components/common/Loader";

export default function ClassroomLoading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-950 min-h-[60vh]">
      <Loader />
    </div>
  );
}
