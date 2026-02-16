/**
 * 종료 시각까지 남은 시간을 HH:MM:SS 형식으로 반환.
 *
 * @param endsAt - ISO 8601 종료 시각 문자열
 * @returns "HH:MM:SS" 형식 문자열 (경과 시 "00:00:00")
 */
export function formatRemainingTime(endsAt: string): string {
  const now = Date.now();
  const end = new Date(endsAt).getTime();

  if (now >= end) return "00:00:00";

  const diff = Math.max(0, Math.floor((end - now) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  return [
    String(h).padStart(2, "0"),
    String(m).padStart(2, "0"),
    String(s).padStart(2, "0"),
  ].join(":");
}
