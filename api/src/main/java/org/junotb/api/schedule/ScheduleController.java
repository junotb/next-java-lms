package org.junotb.api.schedule;

import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.dtos.ScheduleDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDto> get(@PathVariable Long id) {
        return ResponseEntity.of(scheduleService.findById(id).map(ScheduleDto::from));
    }

    @GetMapping("/{id}/attendance")
    public ResponseEntity<ScheduleDto> getAttendance(@PathVariable Long id) {
        return ResponseEntity.of(scheduleService.findById(id).map(ScheduleDto::from));
    }
}
