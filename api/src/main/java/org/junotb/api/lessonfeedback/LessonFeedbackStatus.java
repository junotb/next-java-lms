package org.junotb.api.lessonfeedback;

/**
 * 수업 피드백 처리 상태.
 * - PENDING: vttContent만 저장됨, Gemini 미호출
 * - PROCESSING: Gemini 호출 중
 * - COMPLETED: feedbackContent 저장 완료
 * - FAILED: Gemini 처리 실패
 */
public enum LessonFeedbackStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED
}
