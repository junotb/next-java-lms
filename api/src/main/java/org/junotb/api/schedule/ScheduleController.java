package org.junotb.api.schedule;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.web.PageResponse;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleListRequest;
import org.junotb.api.schedule.web.ScheduleMeetLinkRequest;
import org.junotb.api.schedule.web.ScheduleResponse;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

/**
 * 수업 스케줄 관리 API. 강사는 본인 스케줄 생성·수정·삭제, Meet 링크 등록.
 */
@Tag(name = "Schedule", description = "수업 스케줄 관리 API")
@RestController
@RequestMapping("/api/v1/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    /**
     * 스케줄 목록을 페이징하여 조회. 강사·코스·상태로 필터링 가능.
     *
     * @param request  필터 조건 (userId, courseId, status)
     * @param pageable 페이징
     * @return 페이징된 스케줄 목록
     */
    @Operation(summary = "스케줄 목록 조회", description = "강사·코스·상태로 필터링하여 페이징 조회합니다.")
    @GetMapping("")
    public PageResponse<ScheduleResponse> list(@ModelAttribute ScheduleListRequest request, Pageable pageable) {
        ScheduleListRequest safeRequest = Objects.requireNonNullElse(request, ScheduleListRequest.empty());

        return PageResponse.from(
            scheduleService.findList(safeRequest, pageable).map(ScheduleResponse::from)
        );
    }

    /**
     * ID로 스케줄 조회.
     *
     * @param id 스케줄 ID
     * @return 스케줄 정보 (없으면 404)
     */
    @Operation(summary = "스케줄 조회", description = "ID로 스케줄을 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> get(@PathVariable Long id) {
        return ResponseEntity.of(scheduleService.findById(id).map(ScheduleResponse::from));
    }

    /**
     * 새 수업 스케줄 생성. 인증된 사용자(강사)가 자신의 스케줄로 등록.
     *
     * @param userId  인증된 강사 ID
     * @param request 생성 요청 (courseId, startsAt, endsAt, status)
     * @return 생성된 스케줄
     * @throws ResourceNotFoundException 강사 또는 코스 미존재 시
     */
    @Operation(summary = "스케줄 생성", description = "강사가 수업 일정을 등록합니다.")
    @PostMapping
    public ResponseEntity<ScheduleResponse> create(
        @AuthenticationPrincipal String userId,
        @RequestBody @Valid ScheduleCreateRequest request
    ) {
        Schedule schedule = scheduleService.create(userId, request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    /**
     * 스케줄 수정. null이 아닌 필드만 업데이트.
     *
     * @param id      스케줄 ID
     * @param request 수정 요청 (startsAt, endsAt, status)
     * @return 수정된 스케줄
     * @throws ResourceNotFoundException 스케줄 미존재 시
     */
    @Operation(summary = "스케줄 수정", description = "null이 아닌 필드만 부분 수정합니다.")
    @PatchMapping("/{id}")
    public ResponseEntity<ScheduleResponse> update(
        @PathVariable Long id,
        @RequestBody @Valid ScheduleUpdateRequest request
    ) {
        Schedule schedule = scheduleService.update(id, request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    /**
     * 강사 전용. 해당 스케줄의 Google Meet 링크 등록/수정.
     *
     * @param id      스케줄 ID
     * @param userId  인증된 강사 ID (본인 확인용)
     * @param request meet 링크 요청
     * @return 수정된 스케줄
     * @throws ResourceNotFoundException 스케줄 미존재 시
     * @throws IllegalStateException      요청자가 해당 스케줄의 강사가 아님
     */
    @Operation(summary = "Meet 링크 등록/수정", description = "강사 전용. 수업의 Meet 링크를 등록하거나 수정합니다.")
    @PatchMapping("/{id}/meet-link")
    public ResponseEntity<ScheduleResponse> updateMeetLink(
        @PathVariable Long id,
        @AuthenticationPrincipal String userId,
        @RequestBody @Valid ScheduleMeetLinkRequest request
    ) {
        Schedule schedule = scheduleService.updateMeetLink(id, userId, request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    /**
     * 스케줄 삭제(취소). 논리 삭제로 상태를 CANCELED로 변경.
     *
     * @param id 스케줄 ID
     * @return 204 No Content
     * @throws ResourceNotFoundException 스케줄 미존재 시
     */
    @Operation(summary = "스케줄 삭제", description = "논리 삭제로 취소 처리합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 강사별 스케줄 상태 통계. 대시보드용.
     *
     * @param userId 인증된 강사 ID
     * @return 상태(ScheduleStatus)별 건수
     */
    @Operation(summary = "상태별 통계", description = "강사의 스케줄 상태별 건수를 반환합니다.")
    @GetMapping("/stats/status")
    public ResponseEntity<Map<ScheduleStatus, Long>> countByStatus(@AuthenticationPrincipal String userId) {
        Map<ScheduleStatus, Long> stats = scheduleService.countByStatus(userId);
        return ResponseEntity.ok(stats);
    }
}
