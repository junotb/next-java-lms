package org.junotb.api.domain.teacherSchedule;

import jakarta.persistence.*;
import lombok.*;
import org.junotb.api.domain.teacher.TeacherId;

import java.time.OffsetDateTime;

@Entity
@Table(name = "teacher_schedules")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TeacherSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Transient
    public TeacherScheduleId getTeacherScheduleId() {
        return new TeacherScheduleId(this.id);
    }

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "teacher_id", nullable = false))
    private TeacherId teacherId;

    @Column(name = "starts_at", nullable = false)
    private OffsetDateTime startsAt;

    @Column(name = "ends_at", nullable = false)
    private OffsetDateTime endsAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        var now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
