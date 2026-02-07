package org.junotb.api.teach;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.junotb.api.dashboard.TeachDashboardService;
import org.junotb.api.dashboard.dto.TeachDashboardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teach")
@RequiredArgsConstructor
@Tag(name = "Teach", description = "강사용 API")
public class TeachController {

    private final TeachDashboardService teachDashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "강사 대시보드", description = "다음 수업, 오늘 현황, 오늘 일정을 반환합니다.")
    public ResponseEntity<TeachDashboardResponse> getDashboard(@AuthenticationPrincipal String teacherId) {
        TeachDashboardResponse response = teachDashboardService.getDashboard(teacherId);
        return ResponseEntity.ok(response);
    }
}
