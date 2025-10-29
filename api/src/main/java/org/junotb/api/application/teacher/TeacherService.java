package org.junotb.api.application.teacher;

import org.junotb.api.domain.teacher.Teacher;
import org.junotb.api.domain.teacher.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public Optional<Teacher> findById(Long id) {
        return teacherRepository.findById(id);
    }
}
