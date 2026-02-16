package org.junotb.api.schedulefeedback;

import jakarta.persistence.*;
import lombok.*;
import org.junotb.api.schedule.Schedule;

import java.time.OffsetDateTime;

/**
 * 수업 녹화본의 VTT 자막 및 AI 피드백.
 * Schedule 1:1. 비디오 업로드 후 STT로 vttContent 저장, Gemini로 feedbackContent 생성.
 */
@Entity
@Table(
    name = "\"schedule_feedback\"",
    uniqueConstraints = @UniqueConstraint(name = "uk_schedule_feedback_schedule", columnNames = {"\"scheduleId\""})
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class ScheduleFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"scheduleId\"", nullable = false)
    private Schedule schedule;

    @Column(name = "\"vttContent\"", columnDefinition = "TEXT")
    private String vttContent;

    @Column(name = "\"feedbackContent\"", columnDefinition = "TEXT")
    private String feedbackContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"feedbackStatus\"", nullable = false)
    private ScheduleFeedbackStatus feedbackStatus;

    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "\"updatedAt\"", nullable = false)
    private OffsetDateTime updatedAt;

    public static ScheduleFeedback createForProcessing(Schedule schedule) {
        return ScheduleFeedback.builder()
            .schedule(schedule)
            .vttContent(null)
            .feedbackStatus(ScheduleFeedbackStatus.PROCESSING)
            .build();
    }

    public static ScheduleFeedback create(Schedule schedule, String vttContent) {
        return ScheduleFeedback.builder()
            .schedule(schedule)
            .vttContent(vttContent)
            .feedbackStatus(ScheduleFeedbackStatus.PENDING)
            .build();
    }

    @PrePersist
    void onCreate() {
        var now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
