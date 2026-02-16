"use client";

import { useState, useEffect } from "react";
import { formatRemainingTime } from "@/lib/countdown";

/**
 * 종료 시각까지 남은 시간을 1초 간격으로 갱신.
 *
 * @param endsAt - ISO 8601 종료 시각 문자열
 * @returns "HH:MM:SS" 형식의 남은 시간 문자열
 */
export function useCountdown(endsAt: string): string {
  const [remaining, setRemaining] = useState(() =>
    formatRemainingTime(endsAt)
  );

  useEffect(() => {
    const update = () => setRemaining(formatRemainingTime(endsAt));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return remaining;
}
