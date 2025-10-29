package org.junotb.api.presentation.teacherAttendance;

import org.junotb.api.application.teacherAttendance.TeacherAttendanceService;
import org.junotb.api.domain.teacherAttendance.TeacherAttendance;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherAttendanceController {

    private final TeacherAttendanceService teacherAttendanceService;

    public TeacherAttendanceController(TeacherAttendanceService teacherAttendanceService) {
        this.teacherAttendanceService = teacherAttendanceService;
    }

    @GetMapping("/{teacherId}/schedules/{teacherScheduleId}/attendances")
    public ResponseEntity<List<TeacherAttendance>> getTeacherAttendances(
        @PathVariable Long teacherId,
        @PathVariable Long teacherScheduleId
    ) {
        List<TeacherAttendance> attendances = teacherAttendanceService.findByTeacherScheduleId(teacherScheduleId);
        return ResponseEntity.ok(attendances);
    }
}
