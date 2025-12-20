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

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("")
    public PageResponse<ScheduleResponse> list(@ModelAttribute ScheduleListRequest request, Pageable pageable) {
        return PageResponse.from(
            scheduleService.findList(request, pageable).map(ScheduleResponse::from)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> get(@PathVariable Long id) {
        return ResponseEntity.of(scheduleService.findById(id).map(ScheduleResponse::from));
    }

    @PostMapping
    public ResponseEntity<ScheduleResponse> create(@RequestBody @Valid ScheduleCreateRequest request) {
        Schedule schedule = scheduleService.create(request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ScheduleResponse> update(@PathVariable Long id, @RequestBody @Valid ScheduleUpdateRequest request) {
        Schedule schedule = scheduleService.update(id, request);
        return ResponseEntity.ok(ScheduleResponse.from(schedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
