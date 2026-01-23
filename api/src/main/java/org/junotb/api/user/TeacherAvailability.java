package org.junotb.api.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(
    name = "\"teacherAvailability\"",
    indexes = {
        @Index(name = "idx_teacher_availability_teacher_day", columnList = "\"teacherId\", \"dayOfWeek\"")
    }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class TeacherAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"id\"")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"teacherId\"", nullable = false, foreignKey = @ForeignKey(name = "fk_teacher_availability_teacher"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User teacher;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"dayOfWeek\"", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "\"startTime\"", nullable = false)
    private LocalTime startTime;

    @Column(name = "\"endTime\"", nullable = false)
    private LocalTime endTime;

    public static TeacherAvailability create(
            User teacher,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime
    ) {
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new IllegalArgumentException("시작 시간은 종료 시간보다 빨라야 합니다.");
        }

        return TeacherAvailability.builder()
                .teacher(teacher)
                .dayOfWeek(dayOfWeek)
                .startTime(startTime)
                .endTime(endTime)
                .build();
    }
}
