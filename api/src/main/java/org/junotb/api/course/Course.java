package org.junotb.api.course;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "\"course\"")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Course {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "\"id\"")
  private Long id;

  @Column(name = "\"title\"", nullable = false)
  private String title;

  @Column(name = "\"description\"")
  private String description;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "\"status\"", nullable = false)
  private CourseStatus status;

  @Column(name = "\"createdAt\"", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "\"updatedAt\"", nullable = false)
  private OffsetDateTime updatedAt;

  public static Course create(
      String title,
      String description,
      CourseStatus status
  ) {
    return Course.builder()
        .title(title)
        .description(description)
        .status(status)
        .build();
  }

  @PrePersist
  void onCreate() {
    OffsetDateTime now = OffsetDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = OffsetDateTime.now();
  }
}
