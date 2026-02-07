package org.junotb.api.lessonfeedback;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LessonFeedbackRepository extends JpaRepository<LessonFeedback, Long> {
    Optional<LessonFeedback> findByScheduleId(Long scheduleId);
}
