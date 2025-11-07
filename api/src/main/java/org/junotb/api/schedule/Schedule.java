package org.junotb.api.schedule;

import jakarta.persistence.*;
import lombok.*;
import org.junotb.api.schedule.enums.ScheduleStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@AllArgsConstructor
@Builder
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "starts_at", nullable = false)
    private OffsetDateTime startsAt;

    @Column(name = "ends_at", nullable = false)
    private OffsetDateTime endsAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScheduleStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Transactional
    public static Schedule create(
        Long userId,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        ScheduleStatus status
    ) {
        return Schedule.builder()
            .userId(userId)
            .startsAt(startsAt)
            .endsAt(endsAt)
            .status(status)
            .build();
    }

    @Transactional
    public static Optional<Schedule> update(
        Schedule schedule,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        ScheduleStatus status
    ) {
        schedule.setStartsAt(startsAt);
        schedule.setEndsAt(endsAt);
        schedule.setStatus(status);
        return Optional.of(schedule);
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
