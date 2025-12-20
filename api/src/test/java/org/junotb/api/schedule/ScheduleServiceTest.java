package org.junotb.api.schedule;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junotb.api.schedule.enums.ScheduleStatus.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    ScheduleRepository scheduleRepository;

    @InjectMocks
    ScheduleService scheduleService;

    @Test
    @DisplayName("스케줄 일련번호로 조회하면 Optional 반환")
    void findById() {
        Schedule schedule = Schedule.create(
            1L,
            OffsetDateTime.of(2025, 12, 20, 10, 0, 0, 0, ZoneOffset.ofHours(9)),
            OffsetDateTime.of(2025, 12, 20, 11, 0, 0, 0, ZoneOffset.ofHours(9)),
            SCHEDULED
        );

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        Optional<Schedule> result = scheduleService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getStatus()).isEqualTo(SCHEDULED);
    }

    @Test
    @DisplayName("스케줄 정보를 생성하고 저장")
    void create() {
        OffsetDateTime startsAt = OffsetDateTime.of(2025, 12, 20, 10, 0, 0, 0, ZoneOffset.ofHours(9));
        OffsetDateTime endsAt   = OffsetDateTime.of(2025, 12, 20, 11, 0, 0, 0, ZoneOffset.ofHours(9));

        ScheduleCreateRequest request = new ScheduleCreateRequest(
            1L,
            startsAt,
            endsAt,
            SCHEDULED
        );

        Schedule saved = Schedule.create(
            1L,
            startsAt,
            endsAt,
            SCHEDULED
        );

        when(scheduleRepository.save(any(Schedule.class))).thenReturn(saved);

        Schedule created = scheduleService.create(request);

        assertThat(created.getStatus()).isEqualTo(SCHEDULED);
        assertThat(created.getStartsAt()).isEqualTo(startsAt);
        assertThat(created.getEndsAt()).isEqualTo(endsAt);
    }

    @Test
    @DisplayName("스케줄 정보를 수정하고 반환")
    void update() {
        Schedule schedule = Schedule.create(
            1L,
            OffsetDateTime.of(2025, 12, 20, 10, 0, 0, 0, ZoneOffset.ofHours(9)),
            OffsetDateTime.of(2025, 12, 20, 11, 0, 0, 0, ZoneOffset.ofHours(9)),
            SCHEDULED
        );

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        OffsetDateTime newStartsAt = OffsetDateTime.of(2025, 12, 20, 12, 0, 0, 0, ZoneOffset.ofHours(9));
        OffsetDateTime newEndsAt   = OffsetDateTime.of(2025, 12, 20, 13, 0, 0, 0, ZoneOffset.ofHours(9));

        ScheduleUpdateRequest request = new ScheduleUpdateRequest(
            newStartsAt,
            newEndsAt,
            ATTENDED
        );

        Schedule updated = scheduleService.update(1L, request);

        assertThat(updated.getStartsAt()).isEqualTo(newStartsAt);
        assertThat(updated.getEndsAt()).isEqualTo(newEndsAt);
        assertThat(updated.getStatus()).isEqualTo(ATTENDED);
    }

    @Test
    @DisplayName("스케줄 정보를 취소 상태로 변경")
    void delete() {
        Schedule schedule = Schedule.create(
            1L,
            OffsetDateTime.of(2025, 12, 20, 10, 0, 0, 0, ZoneOffset.ofHours(9)),
            OffsetDateTime.of(2025, 12, 20, 11, 0, 0, 0, ZoneOffset.ofHours(9)),
            SCHEDULED
        );

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        scheduleService.delete(1L);

        assertThat(schedule.getStatus()).isEqualTo(CANCELLED);
    }
}