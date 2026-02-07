package org.junotb.api.registration;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.registration.dto.CourseRegistrationRequest;
import org.junotb.api.registration.web.RegistrationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@Tag(name = "Registration", description = "수강 신청 관리 API")
public class RegistrationController {
    private final RegistrationService registrationService;

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
}
