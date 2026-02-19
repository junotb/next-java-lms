package org.junotb.api.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.user.web.TeacherAvailabilityRequest;
import org.junotb.api.user.web.TeacherAvailabilityResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 강사 가용 시간 설정 API. Time Block 사전 INSERT 대신 조회 시점 계산에 사용.
 */
@Tag(name = "Teacher Availability", description = "강사 가용 시간 설정 API")
@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherAvailabilityController {
    private final TeacherAvailabilityService teacherAvailabilityService;

    /**
     * 강사의 가용 시간 설정을 업데이트합니다. 기존 설정을 전체 교체.
     *
     * @param userId   인증된 사용자 ID (강사)
     * @param requests 가용 시간 설정 요청 목록
     * @return 업데이트된 가용 시간 설정 목록
     */
    @Operation(summary = "가용 시간 업데이트", description = "강사의 요일별 가용 시간을 전체 교체합니다.")
    @PutMapping("/me/availability")
    public ResponseEntity<List<TeacherAvailabilityResponse>> updateAvailability(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid List<TeacherAvailabilityRequest> requests
    ) {
        List<TeacherAvailabilityResponse> responses = teacherAvailabilityService
                .updateAvailability(userId, requests);
        return ResponseEntity.ok(responses);
    }

    /**
     * 강사의 가용 시간 설정을 조회합니다.
     *
     * @param userId 인증된 사용자 ID (강사)
     * @return 가용 시간 설정 목록
     */
    @Operation(summary = "가용 시간 조회", description = "강사의 요일별 가용 시간을 조회합니다.")
    @GetMapping("/me/availability")
    public ResponseEntity<List<TeacherAvailabilityResponse>> getAvailability(
            @AuthenticationPrincipal String userId
    ) {
        List<TeacherAvailabilityResponse> responses = teacherAvailabilityService
                .getAvailability(userId);
        return ResponseEntity.ok(responses);
    }
}
