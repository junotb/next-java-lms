package org.junotb.api.domain.teacher;

import java.util.List;

public interface TeacherService {
    List<Teacher> search(String email);
}
