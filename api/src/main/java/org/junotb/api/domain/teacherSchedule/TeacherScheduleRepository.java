package org.junotb.api.domain.teacherSchedule;

import org.junotb.api.domain.teacher.TeacherId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherScheduleRepository extends JpaRepository<TeacherSchedule, Long> {
    List<TeacherSchedule> findByTeacherId(TeacherId teacherId);
}
