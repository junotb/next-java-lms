package org.junotb.api.domain.teacherAttendance;

import jakarta.persistence.*;
import lombok.*;
import org.junotb.api.domain.teacherSchedule.TeacherScheduleId;

import java.time.OffsetDateTime;

@Entity
@Table(name = "teacher_attendances")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TeacherAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "teacher_schedule_id", nullable = false))
    private TeacherScheduleId teacherScheduleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TeacherAttendanceStatus status;

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