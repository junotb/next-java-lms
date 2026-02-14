"use client";

import { useEffect, useState } from "react";

/**
 * @param query - CSS media query 문자열 (예: "(max-width: 768px)")
 * @returns media query 조건 충족 여부 (SSR에서는 false로 초기화 후 hydration 시 업데이트)
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
