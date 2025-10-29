package org.junotb.api.application.teacherAttendance;

import org.junotb.api.domain.teacherAttendance.TeacherAttendance;
import org.junotb.api.domain.teacherAttendance.TeacherAttendanceRepository;
import org.junotb.api.domain.teacherSchedule.TeacherScheduleId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TeacherAttendanceService {

    private final TeacherAttendanceRepository teacherAttendanceRepository;

    public TeacherAttendanceService(TeacherAttendanceRepository teacherAttendanceRepository) {
        this.teacherAttendanceRepository = teacherAttendanceRepository;
    }

    public List<TeacherAttendance> findByTeacherScheduleId(Long id) {
        TeacherScheduleId teacherScheduleId = new TeacherScheduleId(id);
        return teacherAttendanceRepository.findByTeacherScheduleId(teacherScheduleId);
    }
}
