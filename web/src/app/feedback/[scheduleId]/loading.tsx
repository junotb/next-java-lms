"use client";

import Loader from "@/components/common/Loader";

export default function FeedbackLoading() {
  return (
    <div className="container max-w-4xl py-12 min-h-[50vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}
