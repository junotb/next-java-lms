package org.junotb.api.teacher;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.teacher.dto.TeacherAvailabilityRequest;
import org.junotb.api.teacher.dto.TeacherAvailabilityResponse;
import org.junotb.api.teacher.dto.TeacherSettingsResponse;
import org.junotb.api.teacher.dto.TeacherTimeOffRequest;
import org.junotb.api.teacher.dto.TeacherTimeOffResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers/settings")
@RequiredArgsConstructor
@Tag(name = "Teacher Settings", description = "강사 일정 관리 API")
public class TeacherSettingsController {
    private final TeacherSettingService teacherSettingService;

    @PutMapping("/availability")
    @Operation(
            summary = "근무 가능 시간 일괄 수정",
            description = "강사의 반복적인 근무 요일 및 시간을 일괄 수정합니다. 기존 설정은 모두 삭제되고 새로운 설정으로 교체됩니다."
    )
    public ResponseEntity<List<TeacherAvailabilityResponse>> updateAvailability(
            @AuthenticationPrincipal String teacherId,
            @Valid @RequestBody List<TeacherAvailabilityRequest> request
    ) {
        List<TeacherAvailabilityResponse> response = teacherSettingService.updateAvailability(teacherId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/time-off")
    @Operation(
            summary = "휴무 일정 등록",
            description = "강사의 특정 날짜/기간 휴무 일정을 등록합니다."
    )
    public ResponseEntity<TeacherTimeOffResponse> addTimeOff(
            @AuthenticationPrincipal String teacherId,
            @Valid @RequestBody TeacherTimeOffRequest request
    ) {
        TeacherTimeOffResponse response = teacherSettingService.addTimeOff(teacherId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/time-off/{id}")
    @Operation(
            summary = "휴무 일정 취소",
            description = "등록된 휴무 일정을 취소합니다. 본인의 휴무 일정만 삭제할 수 있습니다."
    )
    public ResponseEntity<Void> removeTimeOff(
            @AuthenticationPrincipal String teacherId,
            @PathVariable Long id
    ) {
        teacherSettingService.removeTimeOff(teacherId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(
            summary = "내 설정 조회",
            description = "인증된 강사의 현재 근무 가능 시간 및 휴무 일정을 조회합니다."
    )
    public ResponseEntity<TeacherSettingsResponse> getSettings(
            @AuthenticationPrincipal String teacherId
    ) {
        TeacherSettingsResponse response = teacherSettingService.getSettings(teacherId);
        return ResponseEntity.ok(response);
    }
}
