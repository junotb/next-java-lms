package org.junotb.api.schedulefeedback.dto;

import org.junotb.api.schedulefeedback.ScheduleFeedback;
import org.junotb.api.schedulefeedback.ScheduleFeedbackStatus;

import java.time.OffsetDateTime;

/**
 * 수업 피드백 조회 응답 DTO.
 */
public record ScheduleFeedbackResponse(
    Long scheduleId,
    String courseTitle,
    OffsetDateTime startsAt,
    OffsetDateTime endsAt,
    String vttContent,
    String feedbackContent,
    ScheduleFeedbackStatus feedbackStatus,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static ScheduleFeedbackResponse from(ScheduleFeedback sf) {
        var s = sf.getSchedule();
        return new ScheduleFeedbackResponse(
            s.getId(),
            s.getCourse() != null ? s.getCourse().getTitle() : null,
            s.getStartsAt(),
            s.getEndsAt(),
            sf.getVttContent(),
            sf.getFeedbackContent(),
            sf.getFeedbackStatus(),
            sf.getCreatedAt(),
            sf.getUpdatedAt()
        );
    }
}
