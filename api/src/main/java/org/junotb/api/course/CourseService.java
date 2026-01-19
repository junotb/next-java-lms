package org.junotb.api.course;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    // 코스 조회
    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }

    // 코스 목록 조회
    public Page<Course> findList(String title, CourseStatus status, Pageable pageable) {
        Specification<Course> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (title != null && !title.isBlank()) {
                predicates = cb.and(
                    predicates,
                    cb.like(root.get("title"), "%" + title + "%")
                );
            }

            if (status != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("status"), status)
                );
            }

            return predicates;
        };

        return courseRepository.findAll(spec, pageable);
    }

    // 코스 생성
    @Transactional
    public Course create(String title, String description, CourseStatus status) {
        if (courseRepository.existsByTitle(title)) {
            throw new DuplicateResourceException("Title", title);
        }

        Course course = Course.create(title, description, status);
        return courseRepository.save(course);
    }

    // 코스 수정
    @Transactional
    public Course update(Long id, String title, String description, CourseStatus status) {
        Course course = courseRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Course not found with id: " + id)
        );

        if (title != null && !title.isBlank()) course.setTitle(title);
        if (description != null) course.setDescription(description);
        if (status != null) course.setStatus(status);

        return course;
    }

    // 코스 삭제
    @Transactional
    public void delete(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Course not found with id: " + id)
        );

        courseRepository.delete(course);
    }

    // 상태별 코스 수 집계
    @Transactional(readOnly = true)
    public Map<CourseStatus, Long> countByStatus() {
        EnumMap<CourseStatus, Long> result = new EnumMap<>(CourseStatus.class);

        for (CourseStatus status : CourseStatus.values()) {
            result.put(status, 0L);
        }

        courseRepository.countByStatus().forEach(row -> result.put(row.getStatus(), row.getCount()));

        return result;
    }
}
