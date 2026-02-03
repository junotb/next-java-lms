package org.junotb.api.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.user.web.TeacherAvailabilityRequest;
import org.junotb.api.user.web.TeacherAvailabilityResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherAvailabilityController {
    private final TeacherAvailabilityService teacherAvailabilityService;

    /**
     * 강사의 가용 시간 설정을 업데이트합니다.
     *
     * @param userId 인증된 사용자 ID (강사)
     * @param requests 가용 시간 설정 요청 목록
     * @return 업데이트된 가용 시간 설정 목록
     */
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
    @GetMapping("/me/availability")
    public ResponseEntity<List<TeacherAvailabilityResponse>> getAvailability(
            @AuthenticationPrincipal String userId
    ) {
        List<TeacherAvailabilityResponse> responses = teacherAvailabilityService
                .getAvailability(userId);
        return ResponseEntity.ok(responses);
    }
}
