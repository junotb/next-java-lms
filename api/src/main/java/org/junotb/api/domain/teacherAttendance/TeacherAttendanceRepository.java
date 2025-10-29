package org.junotb.api.domain.teacherAttendance;

import org.junotb.api.domain.teacherSchedule.TeacherScheduleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherAttendanceRepository extends JpaRepository<TeacherAttendance, Long> {
    List<TeacherAttendance> findByTeacherScheduleId(TeacherScheduleId teacherScheduleId);
}
