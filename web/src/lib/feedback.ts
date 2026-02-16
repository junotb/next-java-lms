import type { FeedbackData } from "@/types/feedback";

/**
 * JSON 문자열 또는 객체를 FeedbackData로 파싱.
 * 마크다운 코드 블록, 이스케이프된 JSON 등 다양한 형식 처리.
 *
 * @param content - JSON 문자열 또는 파싱된 FeedbackData 객체
 * @returns 유효한 FeedbackData 또는 null
 */
export function parseFeedbackContent(
  content: string | FeedbackData | null | undefined
): FeedbackData | null {
  if (!content) return null;

  if (typeof content === "object" && !Array.isArray(content)) {
    return content as FeedbackData;
  }

  if (typeof content !== "string") return null;

  let trimmed = content.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      trimmed = JSON.parse(trimmed) as string;
    } catch {
      // 이스케이프가 아니면 그대로 진행
    }
  }

  try {
    const parsed = JSON.parse(trimmed) as FeedbackData;
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.feedback_summary &&
      Array.isArray(parsed.corrections)
    ) {
      return parsed;
    }
    console.warn("Parsed data does not match expected structure:", parsed);
    return null;
  } catch (e) {
    console.error("Failed to parse feedback content:", e);
    return null;
  }
}
