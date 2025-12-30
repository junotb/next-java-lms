package org.junotb.api.schedule;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.web.PageResponse;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleResponse;
import org.junotb.api.schedule.web.ScheduleListRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    // 스케줄 목록 조회
    @GetMapping("")
    public PageResponse<ScheduleResponse> list(@ModelAttribute ScheduleListRequest request, Pageable pageable) {
        ScheduleListRequest safeRequest = Objects.requireNonNullElse(request, ScheduleListRequest.empty());

        return PageResponse.from(
            scheduleService.findList(safeRequest, pageable).map(ScheduleResponse::from)
        );
    }

    // 스케줄 조회
    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> get(@PathVariable Long id) {
        return ResponseEntity.of(scheduleService.findById(id).map(ScheduleResponse::from));
    }

    // 스케줄 생성
    @PostMapping
    public ResponseEntity<ScheduleResponse> create(@RequestBody @Valid ScheduleCreateRequest request) {
        Schedule schedule = scheduleService.create(request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    // 스케줄 수정
    @PatchMapping("/{id}")
    public ResponseEntity<ScheduleResponse> update(@PathVariable Long id, @RequestBody @Valid ScheduleUpdateRequest request) {
        Schedule schedule = scheduleService.update(id, request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    // 스케줄 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 스케줄 상태별 통계 조회
    @GetMapping("/stats/status")
    public ResponseEntity<Map<ScheduleStatus, Long>> countByStatus(@RequestParam(required = false) String userId) {
        Map<ScheduleStatus, Long> stats = scheduleService.countByStatus(userId);
        return ResponseEntity.ok(stats);
    }
}
