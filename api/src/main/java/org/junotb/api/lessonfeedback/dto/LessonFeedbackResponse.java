package org.junotb.api.lessonfeedback.dto;

import org.junotb.api.lessonfeedback.LessonFeedback;
import org.junotb.api.lessonfeedback.LessonFeedbackStatus;

import java.time.OffsetDateTime;

/**
 * 수업 피드백 조회 응답 DTO.
 */
public record LessonFeedbackResponse(
    Long scheduleId,
    String courseTitle,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    String vttContent,
    String feedbackContent,
    LessonFeedbackStatus feedbackStatus,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static LessonFeedbackResponse from(LessonFeedback lf) {
        var s = lf.getSchedule();
        return new LessonFeedbackResponse(
            s.getId(),
            s.getCourse() != null ? s.getCourse().getTitle() : null,
            s.getStartsAt(),
            s.getEndsAt(),
            lf.getVttContent(),
            lf.getFeedbackContent(),
            lf.getFeedbackStatus(),
            lf.getCreatedAt(),
            lf.getUpdatedAt()
        );
    }
}
