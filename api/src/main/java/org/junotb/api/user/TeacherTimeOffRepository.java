package org.junotb.api.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TeacherTimeOffRepository extends JpaRepository<TeacherTimeOff, Long> {
    List<TeacherTimeOff> findByTeacher_Id(String teacherId);

    List<TeacherTimeOff> findByTeacher_IdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
            String teacherId,
            LocalDateTime endDateTime,
            LocalDateTime startDateTime
    );
}
