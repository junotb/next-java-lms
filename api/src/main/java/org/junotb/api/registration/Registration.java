package org.junotb.api.registration;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.user.User;

import java.time.OffsetDateTime;

@Entity
@Table(
    name = "\"registration\"",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_registration_schedule_student", columnNames = {"\"scheduleId\"", "\"studentId\""})
    }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Registration {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "\"id\"")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "\"scheduleId\"", nullable = false)
  private Schedule schedule;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "\"studentId\"", nullable = false)
  private User student;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "\"status\"", nullable = false)
  private RegistrationStatus status;

  @Column(name = "\"registeredAt\"", nullable = false, updatable = false)
  private OffsetDateTime registeredAt;

  public static Registration create(
      Schedule schedule,
      User student,
      RegistrationStatus status
  ) {
    return Registration.builder()
        .schedule(schedule)
        .student(student)
        .status(status)
        .build();
  }

  @PrePersist
  void onCreate() {
    this.registeredAt = OffsetDateTime.now();
  }
}
