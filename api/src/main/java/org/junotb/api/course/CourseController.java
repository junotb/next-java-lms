package org.junotb.api.course;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.web.PageResponse;
import org.junotb.api.course.web.CourseCreateRequest;
import org.junotb.api.course.web.CourseResponse;
import org.junotb.api.course.web.CourseUpdateRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Course", description = "코스 관리 API")
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "코스 목록 조회", description = "코스 목록을 페이징하여 조회합니다.")
    public ResponseEntity<PageResponse<CourseResponse>> list(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) CourseStatus status,
        Pageable pageable
    ) {
        var courses = courseService.findList(title, status, pageable)
            .map(CourseResponse::from);
        
        return ResponseEntity.ok(PageResponse.from(courses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "코스 조회", description = "ID로 코스를 조회합니다.")
    public ResponseEntity<CourseResponse> get(@PathVariable Long id) {
        return courseService.findById(id)
            .map(CourseResponse::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "코스 생성", description = "새로운 코스를 생성합니다.")
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseCreateRequest request) {
        Course course = courseService.create(request.title(), request.description(), request.status());
        return ResponseEntity.status(HttpStatus.CREATED).body(CourseResponse.from(course));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "코스 수정", description = "기존 코스를 수정합니다.")
    public ResponseEntity<CourseResponse> update(
        @PathVariable Long id,
        @Valid @RequestBody CourseUpdateRequest request
    ) {
        Course course = courseService.update(id, request.title(), request.description(), request.status());
        return ResponseEntity.ok(CourseResponse.from(course));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "코스 삭제", description = "코스를 삭제합니다.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/status")
    @Operation(summary = "상태별 코스 통계", description = "상태별 코스 수를 조회합니다.")
    public ResponseEntity<Map<CourseStatus, Long>> countByStatus() {
        Map<CourseStatus, Long> stats = courseService.countByStatus();
        return ResponseEntity.ok(stats);
    }
}
