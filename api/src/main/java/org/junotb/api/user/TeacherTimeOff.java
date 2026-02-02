package org.junotb.api.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;

@Entity
@Table(
    name = "\"teacherTimeOff\"",
    indexes = {
        @Index(name = "idx_teacher_timeoff_teacher_datetime", columnList = "\"teacherId\", \"startDateTime\", \"endDateTime\"")
    }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class TeacherTimeOff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"teacherId\"", nullable = false, foreignKey = @ForeignKey(name = "fk_teacher_timeoff_teacher"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User teacher;

    @Column(name = "\"startDateTime\"", nullable = false)
    private OffsetDateTime startDateTime;

    @Column(name = "\"endDateTime\"", nullable = false)
    private OffsetDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"type\"", nullable = false)
    private TeacherTimeOffType type;

    @Column(name = "\"reason\"")
    private String reason;

    public static TeacherTimeOff create(
            User teacher,
            OffsetDateTime startDateTime,
            OffsetDateTime endDateTime,
            TeacherTimeOffType type,
            String reason
    ) {
        if (startDateTime.isAfter(endDateTime) || startDateTime.isEqual(endDateTime)) {
            throw new IllegalArgumentException("시작 일시는 종료 일시보다 빨라야 합니다.");
        }

        return TeacherTimeOff.builder()
                .teacher(teacher)
                .startDateTime(startDateTime)
                .endDateTime(endDateTime)
                .type(type)
                .reason(reason)
                .build();
    }
}
