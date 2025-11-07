package org.junotb.api.schedule;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junotb.api.schedule.enums.ScheduleStatus.*;

@DataJpaTest
class ScheduleRepositoryTest {
    @Autowired
    private ScheduleRepository scheduleRepository;

    @Nested
    @DisplayName("findByUserId")
    class FindByUserId {
        @Test
        @DisplayName("should return schedules when they exist for the given user ID")
        void shouldReturnSchedules_whenTheyExistForGivenUserId() {
            OffsetDateTime now = OffsetDateTime.now();
            Long userId = 1L;

            Schedule newSchedule = Schedule.create(
                1L,
                now,
                now.plusHours(1),
                SCHEDULED
            );

            scheduleRepository.save(newSchedule);

            List<Schedule> founds = scheduleRepository.findByUserId(userId);

            assertThat(founds).isNotEmpty();
            assertThat(founds.get(0).getId()).isEqualTo(newSchedule.getId());
        }

        @Test
        @DisplayName("should return empty when no schedules exist for the given user ID")
        void shouldReturnEmpty_whenNoSchedulesExistForGivenUserId() {
            List<Schedule> founds = scheduleRepository.findByUserId(999L);

            assertThat(founds).isEmpty();
        }
    }
}
