package org.junotb.api.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.teacher.dto.TeacherTimeOffRequest;
import org.junotb.api.teacher.dto.TeacherTimeOffResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teachers/me/time-off")
@RequiredArgsConstructor
@Tag(name = "Teacher Time Off", description = "강사 휴무 관리 API")
public class TeacherTimeOffController {

    private final TeacherTimeOffService teacherTimeOffService;

    @PostMapping
    @Operation(summary = "휴무 등록", description = "강사의 휴무 일정을 등록합니다. 기존 휴무·예약 수업과 겹치면 등록할 수 없습니다.")
    public ResponseEntity<TeacherTimeOffResponse> create(
            @AuthenticationPrincipal String teacherId,
            @RequestBody @Valid TeacherTimeOffRequest request
    ) {
        TeacherTimeOffResponse response = teacherTimeOffService.create(teacherId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "휴무 목록 조회", description = "강사의 휴무 목록을 최신순으로 조회합니다.")
    public ResponseEntity<List<TeacherTimeOffResponse>> getList(
            @AuthenticationPrincipal String teacherId
    ) {
        List<TeacherTimeOffResponse> list = teacherTimeOffService.getList(teacherId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "휴무 삭제", description = "등록된 휴무 일정을 삭제합니다. 본인의 휴무만 삭제할 수 있습니다.")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal String teacherId,
            @PathVariable Long id
    ) {
        teacherTimeOffService.delete(id, teacherId);
        return ResponseEntity.noContent().build();
    }
}
