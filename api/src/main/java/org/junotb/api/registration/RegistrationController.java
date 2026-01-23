package org.junotb.api.registration;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.registration.dto.CourseRegistrationRequest;
import org.junotb.api.registration.web.RegistrationRequest;
import org.junotb.api.registration.web.RegistrationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@Tag(name = "Registration", description = "수강 신청 관리 API")
public class RegistrationController {
    private final RegistrationService registrationService;

    @PostMapping
    @Operation(summary = "수강 신청 (기존 스케줄)", description = "학생이 기존 스케줄에 대해 수강 신청을 합니다.")
    public ResponseEntity<RegistrationResponse> register(
        @AuthenticationPrincipal String studentId,
        @Valid @RequestBody RegistrationRequest request
    ) {
        Registration registration = registrationService.register(request.scheduleId(), studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(RegistrationResponse.from(registration));
    }

    @PostMapping("/course")
    @Operation(
            summary = "강좌 수강 신청 (자동 매칭)",
            description = "학생이 강좌를 신청하면 조건에 맞는 강사를 자동으로 매칭하고 스케줄을 생성합니다."
    )
    public ResponseEntity<RegistrationResponse> registerCourse(
            @AuthenticationPrincipal String studentId,
            @Valid @RequestBody CourseRegistrationRequest request
    ) {
        Registration registration = registrationService.registerCourse(studentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(RegistrationResponse.from(registration));
    }

    @GetMapping("/student/me")
    @Operation(summary = "내 신청 내역 조회", description = "인증된 사용자의 모든 수강 신청 내역을 조회합니다.")
    public ResponseEntity<List<RegistrationResponse>> getByStudent(@AuthenticationPrincipal String studentId) {
        List<RegistrationResponse> responses = registrationService.findByStudentId(studentId)
            .stream()
            .map(RegistrationResponse::from)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/schedule/{scheduleId}")
    @Operation(summary = "스케줄별 신청 내역 조회", description = "특정 스케줄의 모든 수강 신청 내역을 조회합니다.")
    public ResponseEntity<List<RegistrationResponse>> getBySchedule(@PathVariable Long scheduleId) {
        List<RegistrationResponse> responses = registrationService.findByScheduleId(scheduleId)
            .stream()
            .map(RegistrationResponse::from)
            .toList();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "수강 신청 취소", description = "등록 ID로 수강 신청을 취소합니다.")
    public ResponseEntity<RegistrationResponse> cancel(@PathVariable Long id) {
        Registration registration = registrationService.cancel(id);
        return ResponseEntity.ok(RegistrationResponse.from(registration));
    }
}
