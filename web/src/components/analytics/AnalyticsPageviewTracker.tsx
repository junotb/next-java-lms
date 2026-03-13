"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IS_ANALYTICS_ENABLED } from "@/constants/analytics";
import { trackPageView } from "@/lib/analytics/client";

/**
 * App Router에서 라우트 변경마다 페이지뷰를 기록합니다.
 */
export default function AnalyticsPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!IS_ANALYTICS_ENABLED) {
      return;
    }

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}
