package org.junotb.api.study;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.junotb.api.dashboard.StudyDashboardService;
import org.junotb.api.dashboard.dto.StudyDashboardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/study")
@RequiredArgsConstructor
@Tag(name = "Study", description = "학생용 API")
public class StudyController {

    private final StudyDashboardService studyDashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "학생 대시보드", description = "다음 수업, 학습 현황, 최근 수업 이력을 반환합니다.")
    public ResponseEntity<StudyDashboardResponse> getDashboard(@AuthenticationPrincipal String studentId) {
        return ResponseEntity.ok(studyDashboardService.getDashboard(studentId));
    }
}
