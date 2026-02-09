package org.junotb.api.lessonfeedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LessonFeedbackRepository extends JpaRepository<LessonFeedback, Long> {
    @Query("SELECT lf FROM LessonFeedback lf JOIN FETCH lf.schedule s WHERE s.id = :scheduleId")
    Optional<LessonFeedback> findByScheduleId(@Param("scheduleId") Long scheduleId);
}
