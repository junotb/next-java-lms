package org.junotb.api.application.teacherSchedule;

import org.junotb.api.domain.teacher.TeacherId;
import org.junotb.api.domain.teacherSchedule.TeacherSchedule;
import org.junotb.api.domain.teacherSchedule.TeacherScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TeacherScheduleService {

    private final TeacherScheduleRepository teacherScheduleRepository;

    public TeacherScheduleService(TeacherScheduleRepository teacherScheduleRepository) {
        this.teacherScheduleRepository = teacherScheduleRepository;
    }

    public List<TeacherSchedule> findByTeacherId(Long id) {
        TeacherId teacherId = new TeacherId(id);
        return teacherScheduleRepository.findByTeacherId(teacherId);
    }
}
