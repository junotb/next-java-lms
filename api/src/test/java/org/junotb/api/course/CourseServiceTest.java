package org.junotb.api.course;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
@DisplayName("CourseService Unit Test")
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @Test
    @DisplayName("create_whenValidData_thenSuccess")
    void create_whenValidData_thenSuccess() {
        // given
        String title = "Java Basics";
        String description = "Learn Java from scratch";
        CourseStatus status = CourseStatus.OPEN;

        Course course = Course.builder()
            .id(1L)
            .title(title)
            .description(description)
            .status(status)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(courseRepository.existsByTitle(title)).willReturn(false);
        given(courseRepository.save(any(Course.class))).willReturn(course);

        // when
        Course result = courseService.create(title, description, status);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo(title);
        assertThat(result.getDescription()).isEqualTo(description);
        assertThat(result.getStatus()).isEqualTo(status);
        then(courseRepository).should().save(any(Course.class));
    }

    @Test
    @DisplayName("create_whenDuplicateTitle_thenThrowException")
    void create_whenDuplicateTitle_thenThrowException() {
        // given
        String title = "Java Basics";
        given(courseRepository.existsByTitle(title)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> courseService.create(title, "Description", CourseStatus.OPEN))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("Title");

        then(courseRepository).should(never()).save(any(Course.class));
    }

    @Test
    @DisplayName("findById_whenCourseExists_thenReturnCourse")
    void findById_whenCourseExists_thenReturnCourse() {
        // given
        Long courseId = 1L;
        Course course = Course.builder()
            .id(courseId)
            .title("Java Basics")
            .status(CourseStatus.OPEN)
            .build();

        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));

        // when
        Optional<Course> result = courseService.findById(courseId);

        // then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(courseId);
    }

    @Test
    @DisplayName("findList_whenFiltersProvided_thenReturnFilteredList")
    void findList_whenFiltersProvided_thenReturnFilteredList() {
        // given
        String title = "Java";
        CourseStatus status = CourseStatus.OPEN;
        Pageable pageable = PageRequest.of(0, 10);

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .status(CourseStatus.OPEN)
            .build();

        Page<Course> coursePage = new PageImpl<>(List.of(course));
        given(courseRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class)))
            .willReturn(coursePage);

        // when
        Page<Course> result = courseService.findList(title, status, pageable);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).contains("Java");
    }

    @Test
    @DisplayName("update_whenCourseExists_thenUpdateSuccess")
    void update_whenCourseExists_thenUpdateSuccess() {
        // given
        Long courseId = 1L;
        String newTitle = "Advanced Java";
        String newDescription = "Deep dive into Java";
        CourseStatus newStatus = CourseStatus.CLOSED;

        Course existingCourse = Course.builder()
            .id(courseId)
            .title("Java Basics")
            .description("Basic Java")
            .status(CourseStatus.OPEN)
            .build();

        given(courseRepository.findById(courseId)).willReturn(Optional.of(existingCourse));

        // when
        Course result = courseService.update(courseId, newTitle, newDescription, newStatus);

        // then
        assertThat(result.getTitle()).isEqualTo(newTitle);
        assertThat(result.getDescription()).isEqualTo(newDescription);
        assertThat(result.getStatus()).isEqualTo(newStatus);
    }

    @Test
    @DisplayName("update_whenCourseNotFound_thenThrowException")
    void update_whenCourseNotFound_thenThrowException() {
        // given
        Long courseId = 999L;
        given(courseRepository.findById(courseId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> courseService.update(courseId, "Title", "Description", CourseStatus.OPEN))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Course not found");
    }

    @Test
    @DisplayName("delete_whenCourseExists_thenDeleteSuccess")
    void delete_whenCourseExists_thenDeleteSuccess() {
        // given
        Long courseId = 1L;
        Course course = Course.builder()
            .id(courseId)
            .title("Java Basics")
            .status(CourseStatus.OPEN)
            .build();

        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));

        // when
        courseService.delete(courseId);

        // then
        then(courseRepository).should().delete(course);
    }

    @Test
    @DisplayName("countByStatus_whenCalled_thenReturnStats")
    void countByStatus_whenCalled_thenReturnStats() {
        // given
        List<StatusCountRow> rows = List.of(
            new StatusCountRow() {
                @Override
                public CourseStatus getStatus() { return CourseStatus.OPEN; }
                @Override
                public Long getCount() { return 10L; }
            },
            new StatusCountRow() {
                @Override
                public CourseStatus getStatus() { return CourseStatus.CLOSED; }
                @Override
                public Long getCount() { return 5L; }
            }
        );

        given(courseRepository.countByStatus()).willReturn(rows);

        // when
        var result = courseService.countByStatus();

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(CourseStatus.OPEN)).isEqualTo(10L);
        assertThat(result.get(CourseStatus.CLOSED)).isEqualTo(5L);
    }
}
