"use client";

import Loader from "@/components/common/Loader";

export default function TeachLoading() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl min-h-[50vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}
