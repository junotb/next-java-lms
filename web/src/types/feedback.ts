/**
 * 피드백 데이터 타입 정의.
 * Gemini API에서 반환하는 JSON 형식의 피드백 구조.
 */

export interface FeedbackSummary {
  opening_message: string;
  closing_message: string;
}

export interface Correction {
  id: number;
  original_sentence: string;
  better_expression: string;
  feedback_detail: string;
}

export interface FeedbackData {
  feedback_summary: FeedbackSummary;
  corrections: Correction[];
}
