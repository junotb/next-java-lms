package org.junotb.api.schedule;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.junotb.api.course.Course;
import org.junotb.api.user.User;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Entity
@Table(name = "\"schedule\"")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Schedule {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "\"id\"")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "\"userId\"", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "\"courseId\"", nullable = false)
  private Course course;

  @Version
  @Column(name = "\"version\"")
  private Long version;

  @Column(name = "\"startsAt\"", nullable = false)
  private OffsetDateTime startsAt;

  @Column(name = "\"endsAt\"", nullable = false)
  private OffsetDateTime endsAt;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "\"status\"", nullable = false)
  private ScheduleStatus status;

  @Column(name = "\"createdAt\"", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "\"updatedAt\"", nullable = false)
  private OffsetDateTime updatedAt;

  @Transactional
  public static Schedule create(
      User user,
      OffsetDateTime startsAt,
      OffsetDateTime endsAt,
      ScheduleStatus status
  ) {
    return Schedule.builder()
        .user(user)
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
