package org.junotb.api.presentation.teacherSchedule;

import org.junotb.api.application.teacherSchedule.TeacherScheduleService;
import org.junotb.api.domain.teacherSchedule.TeacherSchedule;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherScheduleController {

    private final TeacherScheduleService teacherScheduleService;

    public TeacherScheduleController(TeacherScheduleService teacherScheduleService) {
        this.teacherScheduleService = teacherScheduleService;
    }

    @GetMapping("/{teacherId}/schedules")
    public ResponseEntity<List<TeacherSchedule>> getTeacherSchedules(@PathVariable Long teacherId) {
        List<TeacherSchedule> schedules = teacherScheduleService.findByTeacherId(teacherId);
        return ResponseEntity.ok(schedules);
    }
}
