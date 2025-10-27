package org.junotb.api.domain.teacher;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.OffsetDateTime;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class TeacherRepositoryTest {

    @Autowired
    private TeacherRepository teacherRepository;

    @Nested
    @DisplayName("findByEmail")
    class FindByEmail {

        @Test
        @DisplayName("should return entity when email exists")
        void shouldReturnEntity_whenEmailExists() {
            OffsetDateTime now = OffsetDateTime.now();
            Teacher teacher = Teacher.builder()
                    .firstName("Alice")
                    .lastName("Anderson")
                    .email("alice.anderson@example.com")
                    .createdAt(now)
                    .updatedAt(now)
                    .build();
            teacherRepository.save(teacher);

            Optional<Teacher> found = teacherRepository.findByEmail("alice.anderson@example.com");

            assertThat(found).isPresent();
            assertThat(found.get().getEmail()).isEqualTo("alice.anderson@example.com");
        }

        @Test
        @DisplayName("should return empty when email does not exist")
        void shouldReturnEmpty_whenEmailNotExists() {
            Optional<Teacher> found = teacherRepository.findByEmail("nope@example.com");

            assertThat(found).isEmpty();
        }
    }
}
