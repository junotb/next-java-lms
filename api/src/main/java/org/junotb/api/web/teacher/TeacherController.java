package org.junotb.api.web.teacher;

import org.junotb.api.domain.teacher.Teacher;
import org.junotb.api.domain.teacher.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {
    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public ResponseEntity<List<Teacher>> getTeachers(@RequestParam(required = false) String email) {
        try {
            List<Teacher> teacher = teacherService.search(email);
            return ResponseEntity.ok(teacher);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
