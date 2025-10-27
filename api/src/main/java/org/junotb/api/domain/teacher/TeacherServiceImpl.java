package org.junotb.api.domain.teacher;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @Override
    public List<Teacher> search(String email) {
        try {
            if (email == null) {
                return teacherRepository.findAll();
            }

            Teacher teacher = teacherRepository.findByEmail(email).orElseThrow();
            return List.of(teacher);
        } catch (Exception e) {
            throw new EntityNotFoundException("Teachers not found with email " + email);
        }
    }
}
