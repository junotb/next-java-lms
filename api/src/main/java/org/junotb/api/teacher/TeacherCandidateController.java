package org.junotb.api.teacher;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.junotb.api.teacher.dto.TeacherCandidateResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Tag(name = "Teacher Candidates", description = "강사 후보 조회 API (수강 신청 마법사용)")
public class TeacherCandidateController {

    private final TeacherCandidateService teacherCandidateService;

    @GetMapping("/candidates")
    @Operation(
            summary = "가용 강사 후보 조회",
            description = "지정된 요일·시작 시간·수업 분에 가용한 강사 후보 목록을 조회합니다."
    )
    public ResponseEntity<List<TeacherCandidateResponse>> getCandidates(
            @RequestParam String days,
            @RequestParam String startTime,
            @RequestParam int durationMinutes
    ) {
        List<DayOfWeek> dayList = TeacherCandidateService.parseDays(days);
        if (dayList.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        List<TeacherCandidateResponse> candidates = teacherCandidateService.findCandidates(
                dayList, startTime, durationMinutes
        );
        return ResponseEntity.ok(candidates);
    }
}
