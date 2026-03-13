package org.junotb.api.schedulefeedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ScheduleFeedbackRepository extends JpaRepository<ScheduleFeedback, Long> {
    @Query("SELECT sf FROM ScheduleFeedback sf JOIN FETCH sf.schedule s WHERE s.id = :scheduleId")
    Optional<ScheduleFeedback> findByScheduleId(@Param("scheduleId") Long scheduleId);

    @Modifying
    @Query("DELETE FROM ScheduleFeedback sf WHERE sf.schedule.user.id = :userId")
    int deleteBySchedule_UserId(@Param("userId") String userId);
}
